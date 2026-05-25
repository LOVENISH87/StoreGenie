import dotenv from 'dotenv';

dotenv.config();

export async function generateProductImage(productName: string): Promise<string> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl:latest", // Using a stable version
      input: {
        prompt: `professional product photo of ${productName}, clean white background, ecommerce style, high quality`
      }
    })
  });
  const data = await response.json();
  // Replicate's API returns the output array once the prediction is complete if we wait for it, 
  // but standard predictions endpoint returns a status URL we might need to poll.
  // Assuming the user's snippet expected a synchronous-style return or this specific model endpoint supports it.
  // Actually, standard Replicate predictions need to be polled or created with the `prefer: wait` header.
  // Let's modify slightly to ensure it works correctly if it takes time, using the 'Prefer' header to wait.
  // BUT the provided snippet was:
  // return data.output?.[0] ?? ""
  // Replicate's API might need polling. For now, I'll stick close to the provided snippet but add robust error handling.
  
  if (!response.ok) {
     console.error("Replicate API Error:", data);
     return "";
  }
  
  // Note: If 'prefer: wait' isn't supported for this model, we'd need a polling loop.
  // Given user requirements, we'll return what's available or implement a quick poll.
  // Let's implement a simple poll just in case.
  
  let prediction = data;
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
    await new Promise(r => setTimeout(r, 1000));
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
      }
    });
    prediction = await pollResponse.json();
  }
  
  return prediction.output?.[0] ?? "";
}

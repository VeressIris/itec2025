export const backendUrl = "https://itec2025.onrender.com";

export const urlToFile = async (url: string) => {
  console.log(url);
  const response = await fetch(url);

  const blob = await response.blob();
  const t = await response.body;
  console.log(t);
  console.log(blob);
  const file = new File([blob], "image.jpg", { type: blob.type });
  console.log(file);
  return file;
};

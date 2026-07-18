


export const imgUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=d9245b10549b7570daa4fd88a0f1de77`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
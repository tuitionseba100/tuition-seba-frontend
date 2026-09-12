/**
 * Compresses an image file using browser HTML5 Canvas to guarantee it is under maxSizeKB.
 * 
 * @param {File} file - The original image file
 * @param {number} maxKB - Target maximum size in KB (default: 100)
 * @param {number} maxDimension - Max width or height in pixels (default: 800)
 * @returns {Promise<{ file: File, previewUrl: string, sizeKB: number }>}
 */
export async function compressImageUnderMaxKB(file, maxKB = 100, maxDimension = 800) {
    if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.onload = (e) => {
            const img = new Image();
            img.onerror = () => reject(new Error('Failed to load image into memory'));
            img.onload = async () => {
                try {
                    let width = img.width;
                    let height = img.height;

                    // Calculate proportional dimensions
                    if (width > height) {
                        if (width > maxDimension) {
                            height = Math.round((height * maxDimension) / width);
                            width = maxDimension;
                        }
                    } else {
                        if (height > maxDimension) {
                            width = Math.round((width * maxDimension) / height);
                            height = maxDimension;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    // Draw with white background in case of transparent PNG
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    const targetBytes = maxKB * 1024;
                    let quality = 0.85;
                    let compressedBlob = null;

                    // Iterative compression to stay under targetBytes
                    for (let step = 0; step < 6; step++) {
                        compressedBlob = await new Promise((res) => {
                            canvas.toBlob(res, 'image/jpeg', quality);
                        });

                        if (compressedBlob && compressedBlob.size <= targetBytes) {
                            break;
                        }

                        // Reduce quality and/or scale down further if still too large
                        quality -= 0.12;
                        if (quality < 0.25) quality = 0.25;

                        // If still over after a couple passes, downscale canvas dimensions
                        if (step >= 2 && compressedBlob && compressedBlob.size > targetBytes) {
                            width = Math.round(width * 0.8);
                            height = Math.round(height * 0.8);
                            canvas.width = width;
                            canvas.height = height;
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                        }
                    }

                    if (!compressedBlob) {
                        throw new Error('Failed to compress image');
                    }

                    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                    const compressedFile = new File([compressedBlob], fileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    const previewUrl = URL.createObjectURL(compressedBlob);
                    const sizeKB = Math.round((compressedBlob.size / 1024) * 10) / 10;

                    resolve({
                        file: compressedFile,
                        previewUrl,
                        sizeKB
                    });
                } catch (err) {
                    reject(err);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

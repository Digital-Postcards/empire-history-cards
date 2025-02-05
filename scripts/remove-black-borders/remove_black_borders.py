import cv2
import os
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from threading import Lock

print_lock = Lock()


class BorderReplacer:
    def __init__(self, white_threshold=90):
        self.white_threshold = white_threshold

    def find_borders(self, img_path):
        img = cv2.imread(img_path)
        if img is None:
            print("Image not found.")
            return None, None, None, None

        # Convert to Grayscale to simplify image processing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape

        left_border = 0
        right_border = w - 1
        top_border = 0
        bottom_border = h - 1

        # Find left border
        for i in range(w):
            col = gray[:, i]
            if np.mean(col) > self.white_threshold:
                left_border = max(0, i - 5)
                break

        # Find right border
        for i in range(w - 1, -1, -1):
            col = gray[:, i]
            if np.mean(col) > self.white_threshold:
                right_border = min(w - 1, i + 5)
                break

        # Find top border
        for i in range(h):
            row = gray[i, :]
            if np.mean(row) > self.white_threshold:
                top_border = max(0, i - 5)
                break

        # Find bottom border
        for i in range(h - 1, -1, -1):
            row = gray[i, :]
            if np.mean(row) > self.white_threshold:
                bottom_border = min(h - 1, i + 5)
                break

        return left_border, right_border, top_border, bottom_border


class ImageProcessor:
    def replace_black_borders(self, img_path, left_border, right_border, top_border, bottom_border, output_folder):
        img = cv2.imread(img_path)
        if img is None:
            with print_lock:
                print("Image not found.")
            return

        h, w, _ = img.shape
        white_image = np.ones((h, w, 3), dtype=np.uint8) * 255
        white_image[top_border:bottom_border, left_border:right_border] = img[top_border:bottom_border,
                                                                          left_border:right_border]

        # Ensuring all edges and corners are fully white
        white_image[:top_border + 10, :] = 255
        white_image[bottom_border - 10:, :] = 255
        white_image[:, :left_border + 10] = 255
        white_image[:, right_border - 10:] = 255

        output_path = os.path.join(output_folder, os.path.basename(img_path))
        cv2.imwrite(output_path, white_image)

        with print_lock:
            print(f"Saved image with white borders to {output_path}")


def ensure_output_folder_exists(output_folder, input_folder):
    if output_folder is None:
        output_folder = "processed_" + input_folder
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    return output_folder


def process_image(filename, input_folder, output_folder):
    output_folder = ensure_output_folder_exists(output_folder, input_folder)
    file_extension = filename.lower().split('.')[-1]
    supported_formats = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif']
    if file_extension in supported_formats:
        input_path = os.path.join(input_folder, filename)
        analyzer = BorderReplacer()
        processor = ImageProcessor()
        left_border, right_border, top_border, bottom_border = analyzer.find_borders(input_path)

        if left_border is not None and right_border is not None and top_border is not None and bottom_border is not None:
            processor.replace_black_borders(input_path, left_border, right_border, top_border, bottom_border,
                                            output_folder)


if __name__ == "__main__":
    input_folder = "images"
    output_folder = "processed_images"

    # Using ThreadPoolExecutor to process images in parallel
    with ThreadPoolExecutor() as executor:
        for filename in os.listdir(input_folder):
            executor.submit(process_image, filename, input_folder, output_folder)

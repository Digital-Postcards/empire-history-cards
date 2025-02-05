# Image Border Detection and Replacement

This Python script is designed to detect and replace the black borders of images stored in a specified folder with white. It ensures that all edges and corners are fully white, making it useful for enhancing scanned documents or images.

## Prerequisites

Before using this script, you need to have the following dependencies installed:

- OpenCV (cv2):
```bash
pip install opencv-python
```

## Usage

1. Place the images you want to process in a folder of your choice. You can set the input folder by modifying the `input_folder` variable in the script.

2. Optionally, specify the output folder where the processed images will be saved by modifying the `output_folder` variable in the script. If not provided, it defaults to a folder named "processed_" followed by the input folder name.

3. Run the script:
```bash
python replace_black_borders.py
```

- The script will now process all the supported files in the input folder, detect black borders, replace them with white, and save the updated images in the output folder.

## Customization

- The `white_threshold` parameter in the `BorderReplacer` class has been set to 85 to improve the detection of borders. This allows for better separation between the actual content and the surrounding borders, even in images with intricate patterns.
- In image processing, pixel values typically range from 0 to 255, where 0 represents black and 255 represents white. The `white_threshold` parameter determines how light a pixel must be to be considered part of a white border. A value closer to 255 makes the script more sensitive to detecting white and very light colors.
- The script ensures complete removal of black borders by slightly expanding the detected borders and explicitly filling all outer regions with white.

## Example

In the provided script, the default `input_folder` is set to "images," and the default `output_folder` is set to "processed_images." You can replace these values with your own folder paths.

```python
input_folder = "your_input_folder"
output_folder = "your_output_folder"
```

Please replace `"your_input_folder"` and `"your_output_folder"` with the actual folder paths you want to use.


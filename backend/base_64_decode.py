import base64
def base64_to_jpeg(base64_string, output_filepath):
    """
    Converts a Base64 encoded string to a JPEG image file.

    Args:
        base64_string (str): The Base64 encoded string of the JPEG image.
        output_filepath (str): The path where the JPEG image will be saved.
    """
    try:

        if ',' in base64_string:
            base64_string = base64_string.split(',', 1)[1]

        # Decode the Base64 string to binary data
        image_binary_data = base64.b64decode(base64_string)

        # Write the binary data to a JPEG file
        with open(output_filepath, 'wb') as f:
            f.write(image_binary_data)
        print(f"Image successfully saved to {output_filepath}")
        return output_filepath
    
    except Exception as e:
        print(f"An error occurred: {e}")
import os
from PIL import Image

def crop_center_square(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    image_count = {}
    error_files = {}

    for root, _, files in os.walk(input_folder):
        relative_path = os.path.relpath(root, input_folder)
        output_subfolder = os.path.join(output_folder, relative_path)
        if not os.path.exists(output_subfolder):
            os.makedirs(output_subfolder)

        file_counter = 1
        image_count[relative_path] = 0

        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.avif')):
                try:
                    safe_filename = filename.split('@')[0]
                    img_path = os.path.join(root, filename)
                    
                    if filename.lower().endswith('.avif'):
                        img = Image.open(img_path).convert('RGB')
                    else:
                        img = Image.open(img_path)

                    width, height = img.size
                    new_size = min(width, height)
                    left = (width - new_size) // 2
                    top = (height - new_size) // 2
                    right = (width + new_size) // 2
                    bottom = (height + new_size) // 2

                    img_cropped = img.crop((left, top, right, bottom))

                    output_path = os.path.join(output_subfolder, f'{file_counter}.jpg')
                    img_cropped.save(output_path)

                    print(f'裁剪并保存: {output_path}')
                    file_counter += 1
                    image_count[relative_path] += 1
                except Exception as e:
                    print(f'处理文件 {filename} 时出错: {e}')
                    if relative_path not in error_files:
                        error_files[relative_path] = []
                    error_files[relative_path].append(f"{filename}: {str(e)}")
            else:
                print(f'跳过非图片文件: {filename}')

    print("\n处理结果：")
    for folder, count in image_count.items():
        print(f'子文件夹 "{folder}" - 成功处理 {count} 张图片')
        if folder in error_files and error_files[folder]:
            print(f'  出错文件：')
            for error in error_files[folder]:
                print(f'    × {error}')
        else:
            print(f'  无出错文件')

input_folder = 'src/assets/image/'
output_folder = 'assets/image/'
crop_center_square(input_folder, output_folder)
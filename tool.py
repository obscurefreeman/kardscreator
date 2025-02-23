import os
from PIL import Image

def crop_center_square(input_folder, output_folder):
    # 创建输出文件夹（如果不存在）
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 计数器，用于命名输出文件
    file_counter = 1

    # 遍历输入文件夹及其子文件夹中的所有文件
    for root, _, files in os.walk(input_folder):
        # 创建对应的子文件夹
        relative_path = os.path.relpath(root, input_folder)
        output_subfolder = os.path.join(output_folder, relative_path)
        if not os.path.exists(output_subfolder):
            os.makedirs(output_subfolder)

        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                try:
                    # 打开图片
                    img_path = os.path.join(root, filename)
                    img = Image.open(img_path)

                    # 计算裁剪区域
                    width, height = img.size
                    new_size = min(width, height)
                    left = (width - new_size) // 2
                    top = (height - new_size) // 2
                    right = (width + new_size) // 2
                    bottom = (height + new_size) // 2

                    # 裁剪图片
                    img_cropped = img.crop((left, top, right, bottom))

                    # 保存裁剪后的图片，按顺序命名
                    output_path = os.path.join(output_subfolder, f'{file_counter}.jpg')
                    img_cropped.save(output_path)

                    print(f'裁剪并保存: {output_path}')
                    file_counter += 1
                except Exception as e:
                    print(f'处理文件 {filename} 时出错: {e}')
            else:
                print(f'跳过非图片文件: {filename}')

# 使用示例
input_folder = 'assets/image/artillery'  # 输入文件夹路径
output_folder = 'assets/imageoutput'  # 输出文件夹路径
crop_center_square(input_folder, output_folder)
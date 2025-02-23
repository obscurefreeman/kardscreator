import os
from PIL import Image

def crop_center_square(input_folder, output_folder):
    # 创建输出文件夹（如果不存在）
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 用于记录每个子文件夹的图片数量和错误文件
    image_count = {}
    error_files = {}  # 新增错误记录字典

    # 遍历输入文件夹及其子文件夹中的所有文件
    for root, _, files in os.walk(input_folder):
        # 创建对应的子文件夹
        relative_path = os.path.relpath(root, input_folder)
        output_subfolder = os.path.join(output_folder, relative_path)
        if not os.path.exists(output_subfolder):
            os.makedirs(output_subfolder)

        # 计数器，用于命名输出文件
        file_counter = 1
        image_count[relative_path] = 0  # 初始化计数

        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.avif')):
                try:
                    # 处理包含特殊字符的文件名
                    safe_filename = filename.split('@')[0]  # 去除@符号后的内容
                    img_path = os.path.join(root, filename)
                    
                    # 显式指定AVIF格式（需要pillow-avif-plugin）
                    if filename.lower().endswith('.avif'):
                        img = Image.open(img_path).convert('RGB')  # 转换为RGB模式
                    else:
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
                    image_count[relative_path] += 1  # 更新计数
                except Exception as e:
                    print(f'处理文件 {filename} 时出错: {e}')
                    # 记录错误文件信息
                    if relative_path not in error_files:
                        error_files[relative_path] = []
                    error_files[relative_path].append(f"{filename}: {str(e)}")
            else:
                print(f'跳过非图片文件: {filename}')

    # 汇报每个子文件夹的图片数量
    print("\n处理结果：")
    for folder, count in image_count.items():
        print(f'子文件夹 "{folder}" - 成功处理 {count} 张图片')
        # 显示该文件夹的错误文件
        if folder in error_files and error_files[folder]:
            print(f'  出错文件：')
            for error in error_files[folder]:
                print(f'    × {error}')
        else:
            print(f'  无出错文件')

# 使用示例
input_folder = 'src/assets/image/'  # 输入文件夹路径
output_folder = 'assets/image/'  # 输出文件夹路径
crop_center_square(input_folder, output_folder)
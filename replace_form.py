#!/usr/bin/env python3
# 기존 index.html의 폼을 새 폼으로 교체

# 파일 읽기
with open('/home/user/webapp/public/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 새 폼 읽기
with open('/home/user/webapp/NEW_FORM_v31.0.html', 'r', encoding='utf-8') as f:
    new_form = f.read()

# 2710줄까지 유지 (0-based index: 0~2709)
before_form = lines[:2710]

# 2992줄부터 끝까지 유지 (0-based index: 2991~)
after_form = lines[2991:]

# 새 파일 작성
with open('/home/user/webapp/public/index.html', 'w', encoding='utf-8') as f:
    # 폼 이전 부분
    f.writelines(before_form)
    # 새 폼
    f.write(new_form)
    # 폼 이후 부분
    f.writelines(after_form)

print("✅ Form replaced successfully!")
print(f"Before form: {len(before_form)} lines")
print(f"After form: {len(after_form)} lines")
print(f"New form: {len(new_form.splitlines())} lines")

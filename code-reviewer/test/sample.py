#!/usr/bin/env python3
"""
Python 代码规范测试文件
包含多种代码问题的示例
"""

import os
import sys
from typing import List, Dict

# 问题 1: 魔法数字
MAX_RETRY = 3
TIMEOUT = 86400000  # 应该使用更具描述性的名称

# 问题 2: 使用 eval (安全风险)
def execute_user_code(code: str):
    """执行用户代码 - 危险！"""
    result = eval(code)  # ❌ 安全风险
    return result

# 问题 3: 可变默认参数
def append_item(item, list=[]):  # ❌ 可变默认参数
    """添加项目到列表"""
    list.append(item)
    return list

# 问题 4: 裸露的 except
def read_file(filename: str) -> str:
    """读取文件内容"""
    try:
        f = open(filename, 'r')  # ❌ 未使用 with
        content = f.read()
        f.close()
        return content
    except:  # ❌ 裸露的 except
        return ""

# 问题 5: 函数过长且做多件事
def process_user_data(users: List[Dict]) -> Dict:
    """
    处理用户数据 - 这个函数做了太多事情
    """
    result = {}
    for user in users:
        if user.get('active'):
            # 验证
            if user.get('email') and '@' in user.get('email', ''):
                # 处理
                name = user.get('name', 'Unknown')
                email = user.get('email', '')
                age = user.get('age', 0)
                
                # 计算
                if age > 18:
                    category = 'adult'
                else:
                    category = 'minor'
                
                # 存储
                result[email] = {
                    'name': name,
                    'age': age,
                    'category': category,
                    'processed': True
                }
    
    # 报告
    print(f"Processed {len(result)} users")
    
    # 保存
    with open('report.json', 'w') as f:
        import json
        json.dump(result, f)
    
    return result

# 问题 6: 嵌套过深
def validate_order(order: Dict) -> bool:
    """验证订单"""
    if order:
        if order.get('items'):
            if len(order.get('items', [])) > 0:
                if order.get('customer'):
                    if order.get('payment'):
                        return True
    return False

# 问题 7: 缺少类型提示
def calculate_total(items):  # ❌ 缺少类型提示
    total = 0
    for item in items:
        total += item.get('price', 0)
    return total

# 问题 8: 未使用上下文管理器
def write_log(message: str):
    """写入日志"""
    f = open('app.log', 'a')  # ❌ 应该使用 with
    f.write(message + '\n')
    f.close()

# 问题 9: 重复代码
def process_admins(users: List[Dict]) -> List[Dict]:
    """处理管理员"""
    result = []
    for user in users:
        if user.get('role') == 'admin':
            result.append({
                'id': user.get('id'),
                'name': user.get('name'),
                'email': user.get('email')
            })
    return result

def process_vips(users: List[Dict]) -> List[Dict]:
    """处理 VIP 用户 - 与上面重复"""
    result = []
    for user in users:
        if user.get('role') == 'vip':
            result.append({
                'id': user.get('id'),
                'name': user.get('name'),
                'email': user.get('email')
            })
    return result

# 问题 10: 类设计问题
class UserData:
    """只有数据的类"""
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

# 好的实践示例
class UserService:
    """好的服务类示例"""
    
    def __init__(self, repository):
        self.repository = repository
    
    def get_user_by_id(self, user_id: int) -> Dict:
        """根据 ID 获取用户"""
        return self.repository.find_by_id(user_id)
    
    def create_user(self, name: str, email: str) -> Dict:
        """创建新用户"""
        if not self._is_valid_email(email):
            raise ValueError("Invalid email")
        
        user = {'name': name, 'email': email}
        return self.repository.save(user)
    
    def _is_valid_email(self, email: str) -> bool:
        """验证邮箱格式"""
        return '@' in email and '.' in email


# 好的实践：使用 with
def read_file_good(filename: str) -> str:
    """读取文件 - 好的实践"""
    with open(filename, 'r') as f:
        return f.read()


# 好的实践：具体异常处理
def divide_numbers(a: int, b: int) -> float:
    """除法运算"""
    try:
        return a / b
    except ZeroDivisionError:
        return 0.0
    except TypeError:
        return 0.0


# 好的实践：列表推导式
def get_active_users(users: List[Dict]) -> List[Dict]:
    """获取活跃用户"""
    return [u for u in users if u.get('active', False)]


# 好的实践：使用 enumerate
def print_users_with_index(users: List[Dict]):
    """打印用户列表"""
    for i, user in enumerate(users, 1):
        print(f"{i}. {user.get('name', 'Unknown')}")


if __name__ == '__main__':
    # 测试代码
    test_users = [
        {'id': 1, 'name': 'Alice', 'email': 'alice@example.com', 'active': True},
        {'id': 2, 'name': 'Bob', 'email': 'bob@example.com', 'active': False},
    ]
    
    service = UserService(None)
    active = get_active_users(test_users)
    print(f"Active users: {len(active)}")

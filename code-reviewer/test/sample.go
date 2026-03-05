package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"sync"
	"time"
)

// 问题 1: 忽略错误
func readFile(filename string) string {
	data, _ := os.ReadFile(filename) // ❌ 忽略错误
	return string(data)
}

// 问题 2: panic 滥用
func getUser(id int) *User {
	if id <= 0 {
		panic("invalid id") // ❌ 应该返回 error
	}
	return &User{ID: id}
}

// 问题 3: defer 在循环中
func processFiles(files []string) error {
	for _, file := range files {
		f, err := os.Open(file)
		if err != nil {
			return err
		}
		defer f.Close() // ❌ defer 在循环中
		
		// 处理文件
		process(f)
	}
	return nil
}

// 问题 4: goroutine 泄漏风险
func startWorkers(count int) {
	for i := 0; i < count; i++ {
		go func() { // ❌ 没有 context 控制
			for {
				// 无限循环
				doWork()
			}
		}()
	}
}

// 问题 5: map 并发不安全
var cache = make(map[string]string) // ❌ 全局 map

func cacheGet(key string) string {
	return cache[key]
}

func cacheSet(key, value string) {
	cache[key] = value // ❌ 并发写入不安全
}

// 问题 6: 错误信息格式
func processOrder(order *Order) error {
	if order == nil {
		return errors.New("Error: Order is nil") // ❌ 错误格式
	}
	return nil
}

// 问题 7: 嵌套过深
func validateRequest(req *Request) bool {
	if req != nil {
		if req.User != nil {
			if req.User.ID > 0 {
				if req.Payload != nil {
					if len(req.Payload.Data) > 0 {
						return true
					}
				}
			}
		}
	}
	return false
}

// 问题 8: 缺少注释
func ProcessData(data []byte) ([]byte, error) { // ❌ 导出函数缺少注释
	result := make([]byte, len(data))
	copy(result, data)
	return result, nil
}

// 问题 9: 返回值顺序
func getUserInfo(id int) (error, *User) { // ❌ error 应该在最后
	return nil, &User{ID: id}
}

// 问题 10: 冗余命名
type UserService struct { // ❌ 在 user 包中会冗余
	users []User
}

func (us *UserService) GetUser(id int) *User {
	for _, u := range us.users {
		if u.ID == id {
			return &u
		}
	}
	return nil
}

// 问题 11: 未等待 goroutine
func processBatch(items []int) {
	for _, item := range items {
		go processItem(item) // ❌ 没有等待完成
	}
	// 函数直接返回
}

// 问题 12: 字符串拼接性能
func buildMessage(parts []string) string {
	result := ""
	for _, part := range parts {
		result += part // ❌ 应该使用 strings.Builder
	}
	return result
}

// ============================================
// 好的实践示例
// ============================================

// UserService 提供用户服务
type UserService struct {
	repo UserRepository
}

// NewUserService 创建用户服务
func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

// GetUser 根据 ID 获取用户
func (s *UserService) GetUser(ctx context.Context, id int) (*User, error) {
	if id <= 0 {
		return nil, fmt.Errorf("invalid user id: %d", id)
	}
	
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("find user: %w", err)
	}
	
	return user, nil
}

// processFilesGood 正确处理多个文件
func processFilesGood(files []string) error {
	for _, file := range files {
		if err := processSingleFile(file); err != nil {
			return err
		}
	}
	return nil
}

func processSingleFile(file string) error {
	f, err := os.Open(file)
	if err != nil {
		return err
	}
	defer f.Close() // ✅ defer 在函数内
	
	return process(f)
}

// startWorkersGood 使用 context 控制 goroutine
func startWorkersGood(ctx context.Context, count int) {
	var wg sync.WaitGroup
	
	for i := 0; i < count; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return // ✅ 优雅退出
				default:
					doWork()
				}
			}
		}()
	}
	
	wg.Wait()
}

// cacheGood 并发安全的缓存
type SafeCache struct {
	mu   sync.RWMutex
	data map[string]string
}

func (c *SafeCache) Get(key string) string {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.data[key]
}

func (c *SafeCache) Set(key, value string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data[key] = value
}

// validateRequestGood 使用卫语句
func validateRequestGood(req *Request) bool {
	if req == nil {
		return false
	}
	if req.User == nil || req.User.ID <= 0 {
		return false
	}
	if req.Payload == nil || len(req.Payload.Data) == 0 {
		return false
	}
	return true
}

// buildMessageGood 使用 strings.Builder
func buildMessageGood(parts []string) string {
	var b strings.Builder
	for _, part := range parts {
		b.WriteString(part)
	}
	return b.String()
}

// processBatchGood 正确等待 goroutine
func processBatchGood(items []int) {
	var wg sync.WaitGroup
	
	for _, item := range items {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			processItem(i)
		}(item)
	}
	
	wg.Wait() // ✅ 等待所有完成
}

// 表格驱动测试示例
func TestCalculateTotal(t *testing.T) {
	tests := []struct {
		name     string
		items    []Item
		expected float64
	}{
		{"empty", []Item{}, 0},
		{"single", []Item{{Price: 10}}, 10},
		{"multiple", []Item{{Price: 10}, {Price: 20}}, 30},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := CalculateTotal(tt.items)
			if got != tt.expected {
				t.Errorf("got %v, want %v", got, tt.expected)
			}
		})
	}
}

func main() {
	ctx := context.Background()
	
	// 使用好的实践
	service := NewUserService(repo)
	user, err := service.GetUser(ctx, 1)
	if err != nil {
		log.Printf("Error: %v", err)
		return
	}
	
	fmt.Printf("User: %+v\n", user)
}

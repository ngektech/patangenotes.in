#!/usr/bin/env python3
"""
PatangeNotes Backend API Testing Suite
Tests all backend endpoints for the blogging platform
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class PatangeNotesAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_post_id = None

    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    expected_status: int = 200, auth_required: bool = False) -> tuple[bool, Dict]:
        """Make HTTP request and validate response"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                return False, {"error": f"Unsupported method: {method}"}

            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {"status_code": response.status_code, "text": response.text}

            return success, response_data

        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.make_request('GET', 'health')
        self.log_test(
            "Health Check", 
            success and response.get('status') == 'healthy',
            f"Response: {response}" if not success else ""
        )
        return success

    def test_admin_login(self):
        """Test admin login with correct credentials"""
        login_data = {
            "email": "admin@patangenotes.in",
            "password": "CobraAdmin@2024Secure!"
        }
        
        success, response = self.make_request('POST', 'auth/login', login_data)
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log_test("Admin Login", True)
            return True
        else:
            self.log_test("Admin Login", False, f"Response: {response}")
            return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        login_data = {
            "email": "admin@patangenotes.in",
            "password": "wrongpassword"
        }
        
        success, response = self.make_request('POST', 'auth/login', login_data, expected_status=401)
        self.log_test(
            "Admin Login (Invalid Credentials)", 
            success,
            f"Response: {response}" if not success else ""
        )
        return success

    def test_auth_verify(self):
        """Test token verification"""
        if not self.token:
            self.log_test("Auth Verify", False, "No token available")
            return False
            
        success, response = self.make_request('GET', 'auth/verify', auth_required=True)
        self.log_test(
            "Auth Verify", 
            success and response.get('authenticated') == True,
            f"Response: {response}" if not success else ""
        )
        return success

    def test_create_blog_post(self):
        """Test creating a new blog post"""
        if not self.token:
            self.log_test("Create Blog Post", False, "No admin token")
            return False

        post_data = {
            "title": "Test Blog Post - AI and Future Technology",
            "excerpt": "A comprehensive analysis of artificial intelligence trends and their impact on society.",
            "content": "This is a detailed test blog post about artificial intelligence and its implications for the future. We explore various aspects of AI development, ethical considerations, and potential societal impacts. The content covers machine learning, deep learning, and emerging AI technologies that are shaping our world.",
            "category": "Artificial Intelligence",
            "tags": ["AI", "Technology", "Future", "Innovation"],
            "featured_image": "https://example.com/ai-image.jpg",
            "sources": ["https://example.com/source1", "https://example.com/source2"],
            "is_featured": True
        }

        success, response = self.make_request('POST', 'admin/posts', post_data, expected_status=200, auth_required=True)
        
        if success and 'id' in response:
            self.created_post_id = response['id']
            self.log_test("Create Blog Post", True)
            return True
        else:
            self.log_test("Create Blog Post", False, f"Response: {response}")
            return False

    def test_get_public_posts(self):
        """Test getting public posts"""
        success, response = self.make_request('GET', 'posts')
        
        posts_valid = success and 'posts' in response and 'total' in response
        self.log_test(
            "Get Public Posts", 
            posts_valid,
            f"Response: {response}" if not posts_valid else f"Found {response.get('total', 0)} posts"
        )
        return posts_valid

    def test_get_single_post(self):
        """Test getting a single post by ID"""
        if not self.created_post_id:
            self.log_test("Get Single Post", False, "No post ID available")
            return False

        success, response = self.make_request('GET', f'posts/{self.created_post_id}')
        
        post_valid = success and 'title' in response and 'content' in response
        self.log_test(
            "Get Single Post", 
            post_valid,
            f"Response: {response}" if not post_valid else f"Retrieved post: {response.get('title', '')}"
        )
        return post_valid

    def test_get_admin_posts(self):
        """Test getting admin posts"""
        if not self.token:
            self.log_test("Get Admin Posts", False, "No admin token")
            return False

        success, response = self.make_request('GET', 'admin/posts', auth_required=True)
        
        posts_valid = success and 'posts' in response and 'total' in response
        self.log_test(
            "Get Admin Posts", 
            posts_valid,
            f"Response: {response}" if not posts_valid else f"Found {response.get('total', 0)} admin posts"
        )
        return posts_valid

    def test_update_blog_post(self):
        """Test updating a blog post"""
        if not self.token or not self.created_post_id:
            self.log_test("Update Blog Post", False, "No token or post ID")
            return False

        update_data = {
            "title": "Updated Test Blog Post - AI and Future Technology",
            "excerpt": "An updated comprehensive analysis of artificial intelligence trends.",
            "is_featured": False
        }

        success, response = self.make_request('PUT', f'admin/posts/{self.created_post_id}', 
                                            update_data, auth_required=True)
        
        update_valid = success and response.get('title') == update_data['title']
        self.log_test(
            "Update Blog Post", 
            update_valid,
            f"Response: {response}" if not update_valid else "Post updated successfully"
        )
        return update_valid

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.make_request('GET', 'categories')
        
        categories_valid = success and 'categories' in response
        self.log_test(
            "Get Categories", 
            categories_valid,
            f"Response: {response}" if not categories_valid else f"Found categories: {response.get('categories', [])}"
        )
        return categories_valid

    def test_get_tags(self):
        """Test getting tags"""
        success, response = self.make_request('GET', 'tags')
        
        tags_valid = success and 'tags' in response
        self.log_test(
            "Get Tags", 
            tags_valid,
            f"Response: {response}" if not tags_valid else f"Found tags: {response.get('tags', [])}"
        )
        return tags_valid

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        subscription_data = {
            "email": "test@example.com"
        }

        success, response = self.make_request('POST', 'newsletter/subscribe', subscription_data)
        
        subscription_valid = success and response.get('subscribed') == True
        self.log_test(
            "Newsletter Subscription", 
            subscription_valid,
            f"Response: {response}" if not subscription_valid else "Newsletter subscription successful"
        )
        return subscription_valid

    def test_get_admin_stats(self):
        """Test getting admin statistics"""
        if not self.token:
            self.log_test("Get Admin Stats", False, "No admin token")
            return False

        success, response = self.make_request('GET', 'admin/stats', auth_required=True)
        
        stats_valid = (success and 'total_posts' in response and 
                      'total_subscribers' in response and 'total_categories' in response)
        self.log_test(
            "Get Admin Stats", 
            stats_valid,
            f"Response: {response}" if not stats_valid else f"Stats: {response}"
        )
        return stats_valid

    def test_get_newsletter_subscribers(self):
        """Test getting newsletter subscribers (admin only)"""
        if not self.token:
            self.log_test("Get Newsletter Subscribers", False, "No admin token")
            return False

        success, response = self.make_request('GET', 'admin/newsletter/subscribers', auth_required=True)
        
        subscribers_valid = success and 'subscribers' in response and 'total' in response
        self.log_test(
            "Get Newsletter Subscribers", 
            subscribers_valid,
            f"Response: {response}" if not subscribers_valid else f"Found {response.get('total', 0)} subscribers"
        )
        return subscribers_valid

    def test_search_posts(self):
        """Test searching posts"""
        success, response = self.make_request('GET', 'posts?search=AI')
        
        search_valid = success and 'posts' in response
        self.log_test(
            "Search Posts", 
            search_valid,
            f"Response: {response}" if not search_valid else f"Search returned {len(response.get('posts', []))} results"
        )
        return search_valid

    def test_filter_posts_by_category(self):
        """Test filtering posts by category"""
        success, response = self.make_request('GET', 'posts?category=Artificial Intelligence')
        
        filter_valid = success and 'posts' in response
        self.log_test(
            "Filter Posts by Category", 
            filter_valid,
            f"Response: {response}" if not filter_valid else f"Category filter returned {len(response.get('posts', []))} results"
        )
        return filter_valid

    def test_delete_blog_post(self):
        """Test deleting a blog post (cleanup)"""
        if not self.token or not self.created_post_id:
            self.log_test("Delete Blog Post", False, "No token or post ID")
            return False

        success, response = self.make_request('DELETE', f'admin/posts/{self.created_post_id}', 
                                            expected_status=200, auth_required=True)
        
        delete_valid = success and response.get('message') == 'Post deleted successfully'
        self.log_test(
            "Delete Blog Post", 
            delete_valid,
            f"Response: {response}" if not delete_valid else "Post deleted successfully"
        )
        return delete_valid

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting PatangeNotes Backend API Tests")
        print("=" * 50)

        # Basic connectivity
        if not self.test_health_check():
            print("❌ Health check failed - backend may not be running")
            return False

        # Authentication tests
        self.test_admin_login_invalid()  # Test invalid login first
        if not self.test_admin_login():
            print("❌ Admin login failed - cannot proceed with authenticated tests")
            return False
        
        self.test_auth_verify()

        # Blog post CRUD operations
        self.test_create_blog_post()
        self.test_get_public_posts()
        self.test_get_single_post()
        self.test_get_admin_posts()
        self.test_update_blog_post()

        # Categories and tags
        self.test_get_categories()
        self.test_get_tags()

        # Newsletter functionality
        self.test_newsletter_subscription()
        self.test_get_newsletter_subscribers()

        # Admin statistics
        self.test_get_admin_stats()

        # Search and filtering
        self.test_search_posts()
        self.test_filter_posts_by_category()

        # Cleanup
        self.test_delete_blog_post()

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    """Main test execution"""
    tester = PatangeNotesAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
            "results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
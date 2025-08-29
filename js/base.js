// 全局通用JS（如头像icon下拉菜单）
document.addEventListener('DOMContentLoaded', function() {
  const userAvatar = document.getElementById('userAvatar');
  const userDropdown = document.getElementById('userDropdown');
  if (userAvatar && userDropdown) {
    userAvatar.addEventListener('click', function(event) {
      event.preventDefault();
      userDropdown.classList.toggle('show');
    });
    document.addEventListener('click', function(event) {
      // 如果点击的是反馈按钮，不关闭下拉菜单
      if (event.target.closest('#feedbackButton')) {
        return;
      }
      if (!userAvatar.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('show');
      }
    });
  }
}); 
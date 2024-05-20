document.addEventListener('DOMContentLoaded', () => {
  const usersSelect = document.getElementById('users');
  const postList = document.getElementById('postList');
  const commentList = document.getElementById('commentList');
  const profileImg = document.getElementById('profileImg');
  const profileName = document.getElementById('profileName');
  const profileUsername = document.getElementById('profileUsername');
  const profileWebsite = document.getElementById('profileWebsite');
  const profileCompany = document.getElementById('profileCompany');
  const profileLocation = document.getElementById('profileLocation');
  const searchInput = document.getElementById('search');

  // Fetch Users and Populate Select Box
  fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => {
          users.forEach(user => {
              const option = document.createElement('option');
              option.value = user.id;
              option.textContent = user.name;
              usersSelect.appendChild(option);
          });

          // Set default user and fetch posts
          usersSelect.value = 1;
          fetchUserProfile(1);
          fetchPosts(1);
      });

  // Fetch User Profile
  function fetchUserProfile(userId) {
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
          .then(response => response.json())
          .then(user => {
              profileImg.src = 'https://sb.kaleidousercontent.com/67418/1672x1018/6463a5af0d/screenshot-2022-05-24-at-15-22-28.png';
              profileName.textContent = user.name;
              profileUsername.textContent = `@${user.username}`;
              profileWebsite.textContent = user.website;
              profileCompany.textContent = user.company.name;
              profileLocation.textContent = user.address.city;
          });
  }

  // Fetch Posts for Selected User
  function fetchPosts(userId) {
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
          .then(response => response.json())
          .then(posts => {
              postList.innerHTML = '';
              posts.forEach(post => {
                  const postDiv = document.createElement('div');
                  postDiv.className = 'post';
                  postDiv.innerHTML = `
                      <img src="https://via.placeholder.com/50" alt="Post Image">
                      <div class="content">
                          <h3>${post.title}</h3>
                          <p>${post.body}</p>
                          <div class="actions">
                              <span>200 Likes</span>
                              <span>200 Comments</span>
                              <span>200 Shares</span>
                          </div>
                      </div>
                  `;
                  postDiv.dataset.postId = post.id;
                  postDiv.addEventListener('click', () => fetchComments(post.id));
                  postList.appendChild(postDiv);
              });

              // Set default post comments
              if (posts.length > 0) {
                  fetchComments(posts[0].id);
              }
          });
  }

  // Fetch Comments for Selected Post
  function fetchComments(postId) {
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
          .then(response => response.json())
          .then(comments => {
              commentList.innerHTML = '';
              comments.forEach(comment => {
                  const commentDiv = document.createElement('div');
                  commentDiv.className = 'comment';
                  commentDiv.innerHTML = `
                      <img src="https://via.placeholder.com/50" alt="Comment Image">
                      <div class="content">
                          <h3>${comment.name}</h3>
                          <p>${comment.body}</p>
                          <div class="actions">
                              <span>0 Likes</span>
                              <span>0 Comments</span>
                              <span>0 Shares</span>
                          </div>
                      </div>
                  `;
                  commentList.appendChild(commentDiv);
              });
          });
  }

  // Event Listener for User Selection
  usersSelect.addEventListener('change', () => {
      const userId = usersSelect.value;
      fetchUserProfile(userId);
      fetchPosts(userId);
  });

  // Event Listener for Search
  searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const options = Array.from(usersSelect.options);
      const matchingOption = options.find(option => option.textContent.toLowerCase().includes(query));
      if (matchingOption) {
          usersSelect.value = matchingOption.value;
          fetchUserProfile(matchingOption.value);
          fetchPosts(matchingOption.value);
      }
  });
});

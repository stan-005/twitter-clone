document.addEventListener('DOMContentLoaded', () => {
    const usersSelect = document.getElementById('users');
    const postList = document.getElementById('postList');
    const commentList = document.getElementById('commentList');
    const profileImg = document.getElementById('profileImg');
    const profileBanner = document.getElementById('profileBanner');
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
        fetchUserProfile(1).then(user => renderUserProfile(user));
        fetchPosts(1);
      });

    
    async function fetchUserProfile(userId) {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await response.json();
        return user;
      } catch (error) {
        console.log(error);
      }
    }


    function renderUserProfile(user) {
      profileImg.src = `https://randomuser.me/api/portraits/men/${user.id}.jpg`;
      profileBanner.src = './images/background.jpg';//banner
      profileName.textContent = user.name;
      profileUsername.textContent = `@${user.username}`;
      profileWebsite.textContent = user.website;
      profileCompany.textContent = user.company.name;
      profileLocation.textContent = user.address.city;
    }
  
    // Fetch Posts for Selected User
    function fetchPosts(userId) {
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(response => response.json())
        .then(posts => {
          postList.innerHTML = '';
          posts.forEach(post => {
            fetchUserProfile(userId).then(user => {
              const postDiv = document.createElement('div');
              postDiv.className = 'post';
              postDiv.innerHTML = `
                <img src="${profileImg.src}" alt="Profile Image">
                <div class="content">
                <p class="paraIcons"><span>${user.name} @${user.username}</span><ion-icon class="paraIcon1" name="checkmark-outline"></ion-icon><ion-icon class="paraIcon2" name="logo-twitter"></ion-icon></p>
                  <p>${post.body}</p>
                  <div class="actions">
                    <span><ion-icon name="chatbubble-ellipses-outline"></ion-icon> 200</span>
                    <span><ion-icon name="git-compare-outline"></ion-icon> 200</span>
                    <span><ion-icon class="heart" name="heart"></ion-icon> 200</span>
                  </div>
                </div>
              `;
              postDiv.dataset.postId = post.id;
              postDiv.addEventListener('click', () => fetchComments(post.id));
              postList.appendChild(postDiv);
            });
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
              <img src="${profileImg.src}" alt="Profile Image">
              <div class="content">
                <p class="paraIcons"><span>${comment.name}</span><ion-icon class="paraIcon1" name="checkmark-outline"></ion-icon><ion-icon class="paraIcon2" name="logo-twitter"></ion-icon></p>
                <p>${comment.body}</p>
                <div class="actions">
                <span><ion-icon name="chatbubble-ellipses-outline"></ion-icon> 0</span>
                <span><ion-icon name="git-compare-outline"></ion-icon> 0</span>
                <span><ion-icon class="heart" name="heart"></ion-icon> 0</span>
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
      // const user = fetchUserProfile(userId);
      // console.log(user);
      fetchUserProfile(userId).then(user => {
        renderUserProfile(user);
        fetchPosts(userId);
      });
    });
  });
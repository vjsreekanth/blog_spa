const BASE_URL = `http://localhost:3000/api/v1`;

const Post = {
    index(){
        return fetch(`${BASE_URL}/posts`)
        .then(res =>{
            console.log(res);
            return res.json();
        })
    },

    show(id){
        return fetch(`${BASE_URL}/posts/${id}`)
        .then(res => res.json());
     },

    create(params){
        return fetch(`${BASE_URL}/posts`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(params)
        }).then((res) => res.json())
    },

   

     destroy(id){
        return fetch(`${BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            credentials: 'include'
            })
    },

      update(id, params){
        return fetch(`${BASE_URL}/posts/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify(params)
        })
        .then((res) => res.json())
    },
}

// function To create session 
const Session = {
    create(params){
        return fetch(`${BASE_URL}/session`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(params)
        })
    }
}

// sign in with a default user
Session.create({
    email: 'yevette@erdman-lemke.biz',
    password: '123'
}).then(console.log)

   

const newPostForm = document.querySelector('#new-post-form')

    newPostForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget
        const formData = new FormData(form);
        const newPostParams = {
            title: formData.get('title'),
            body: formData.get('body'),
        }

        Post.create(newPostParams)
        .then(data => {
            console.log(data)
            newPostForm.reset()
            loadPosts();
            renderPostShow(data.id);
            navigateTo('post-show');
        })
    });


// function to load all posts to index page
const loadPosts =()=> {Post.index()
    .then(posts => {
        const postsContainer = document.querySelector('ul.post-list');
        postsContainer.innerHTML = posts.map(post=>{
            return `
            <li>
            <a class="post-link" data-id="${post.id}" href="">
            ${post.id} - ${post.title}</br>
            `
            }).join('');
        })}
    
    loadPosts();


// Show active page only
function navigateTo(id){
    document.querySelectorAll('.page').forEach(node => {
        node.classList.remove('active')
    });
    document.querySelector(`.page#${id}`).classList.add('active')
}

 //add navigation
 const navbar = document.querySelector('nav.navbar')
 navbar.addEventListener('click', (event) => {
     event.preventDefault();
     const node = event.target;
     const page = node.dataset.target;
     if(page){
         console.log(page);
         navigateTo(page);
     } 
 });

//  enabling show click event
 const postsContainer = document.querySelector('ul.post-list');
    postsContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const postElement = event.target;
        if(postElement.matches('a.post-link')){
        const postId = event.target.dataset.id
        renderPostShow(postId);
        navigateTo('post-show')
        }
    });
          
 // function for showing post details
function renderPostShow(id){
    Post.show(id)
    .then(post => {
        const showPage = document.querySelector('.page#post-show');
        showPage.innerHTML = 
        `<div class="card shadow p-3 m-3 bg-body rounded">
            <div class="card-body">
                <h3 class="card-title">${post.title}</h3>
                <p class="card-text">${post.body}</p>
                <p class="card-text">
                <small class="text-muted">Authored By: ${post.author.name}</small></br>
                <small class="text-muted">Likes: ${post.like_count}</small></br>
                </p>
                <a class="btn btn-primary" data-target='post-edit' data-id='${post.id}' href="">Edit</a>
                <a class="btn btn-primary" data-target='delete-post' data-id='${post.id}' href="">Delete</a>
            </div>
        </div>
        `
    })
}

// function to fill edit-post-form with current values
function populateForm(id){
    Post.show(id).then(postData =>{
       document.querySelector('#edit-post-form [name=title]').value=postData.title;
       document.querySelector('#edit-post-form [name=body]').value=postData.body;
       document.querySelector('#edit-post-form [name=id]').value=postData.id
    })
}

document.querySelector('#post-show').addEventListener('click', (event) =>{
    event.preventDefault();
    const postId = event.target.dataset.id
    const actionNeededToBePerformed = event.target.dataset.target
    if(postId){
        if (actionNeededToBePerformed === 'delete-post'){
            console.log(`delete: ${postId}`)
            Post.destroy(postId).then(data =>{
                loadPosts();
                navigateTo('posts-index');
            })
        }else if(actionNeededToBePerformed === 'posts-index'){
            navigateTo('posts-index');

        }else{
            populateForm(postId);
            navigateTo('post-edit')
        }
    }
});

//edit and update fuction
const editPostForm = document.querySelector('#edit-post-form');
editPostForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    const editFormData = new FormData(event.currentTarget)
    const updatePostParams = {
        title: editFormData.get('title'),
        body: editFormData.get('body'),
        id: editFormData.get('id')
    }
    Post.update(editFormData.get('id'), updatePostParams)
    .then(post => {
        editPostForm.reset();
        loadPosts();
        renderPostShow(post.id);
        navigateTo('post-show')
    });
    

})
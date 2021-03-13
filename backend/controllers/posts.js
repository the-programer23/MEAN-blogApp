const Post = require("../models/post");

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    },
    post
  ).then((response) => {
    if (response.n > 0) {
      res.status(200).json({
        message: "Publicación actualizada con éxito!",
      });
    } else {
      res.status(401).json({
        message: "¡No estás autirozad@!"
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: "No se pudo actualizar la publicación"
    })
  })
}

exports.createPost = (req, res, next) => {
  console.log(req.get("host"))
  const url = req.protocol + "://" + req.get("host");
  // console.log(url)
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Publicación creada con éxito",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      },
    });
  }).catch(error => {
    res.status(500).json({
      message: "No se pudo crear la publicación"
    })
  })
}

exports.getPosts = (req, res, next) => {
  // by default req.query returns a string and the + sign converts it to a number
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find()
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
  }

  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.countDocuments()
  }).then(count => {
    res.status(200).json({
      message: "Publicaciones recuperadas correctamente",
      posts: fetchedPosts,
      maxPosts: count
    })
  }).catch(error => {
    res.status(500).json({
      message: "No se pudieron recuperar las publicaciones"
    })
  })
}

exports.getPost = (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Publicación no encontrada",
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "No se pudo recuperar la publicacion"
    })
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then((response) => {
    if (response.n > 0) {
      res.status(200).json({
        message: "¡Publicación eliminada con éxito!",
      });
    } else {
      res.status(401).json({
        message: "¡No estás autorizad@!"
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: "No se pudo eliminar la publicación"
    })
  })
}

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: "https://mohiuddin200.vercel.app", credentials: true }));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");
    // ==============================================================
    // WRITE YOUR CODE HERE
    // ==============================================================

    // POST Projects
    app.post("/projects", async (req, res) => {
      try {
        const db = client.db("portfolio");
        const projectsCollection = db.collection("allProjects");

        const {
          imageLink,
          title,
          technology,
          description,
          githubLink,
          liveLink,
        } = req.body;

        console.log(req.body);

        if (
          !imageLink ||
          !title ||
          !technology ||
          !githubLink ||
          !description ||
          !liveLink
        ) {
          return res
            .status(400)
            .json({ message: "Not enough data to create projects" });
        }

        await projectsCollection.insertOne({
          imageLink,
          title,
          technology,
          description,
          githubLink,
          liveLink,
        });

        res.status(201).json({
          success: true,
          message: "projects added successfully",
        });
      } catch (error) {
        console.error("Error adding projects details:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET All Projects
    app.get("/projects", async (req, res) => {
      try {
        const db = client.db("portfolio");
        const projectsCollection = db.collection("allProjects");

        const product = await projectsCollection.find(req.query).toArray();
        res.json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET Single project
    app.get("/projects/:id", async (req, res) => {
      try {
        const db = client.db("portfolio");
        const projectsCollection = db.collection("allProjects");

        const projectsId = req.params.id;

        const idToFind = new ObjectId(projectsId);

        // Find the projects by its ID
        const projects = await projectsCollection.findOne({ _id: idToFind });

        if (!projects) {
          return res.status(404).json({ message: "projects not found" });
        }

        res.json(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // POST blogs
    app.post("/blogs", async (req, res) => {
      try {
        const db = client.db("portfolio");
        const blogsCollection = db.collection("allBlogs");

        const { imageLink, blog } = req.body;

        console.log(req.body);

        if (!imageLink || !blog) {
          return res
            .status(400)
            .json({ message: "Not enough data to create blogs" });
        }

        await blogsCollection.insertOne({
          imageLink,
          blog,
        });

        res.status(201).json({
          success: true,
          message: "blogs added successfully",
        });
      } catch (error) {
        console.error("Error adding blogs details:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET All blogs
    app.get("/blogs", async (req, res) => {
      try {
        const db = client.db("portfolio");
        const blogsCollection = db.collection("allBlogs");

        const product = await blogsCollection.find(req.query).toArray();
        res.json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET Single blog
    app.get("/blog/:id", async (req, res) => {
      try {
        const db = client.db("portfolio");
        const blogCollection = db.collection("allBlogs");

        const blogId = req.params.id;

        const idToFind = new ObjectId(blogId);

        // Find the blog by its ID
        const blog = await blogCollection.findOne({ _id: idToFind });

        if (!blog) {
          return res.status(404).json({ message: "blog not found" });
        }

        res.json(blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});

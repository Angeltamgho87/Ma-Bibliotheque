// Classe Book
class Book {
  constructor(title, author, genre, year, isRead) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.year = year;
    this.isRead = isRead;
  }
}

// Classe Library
class Library {
  constructor() {
    this.books = [];
  }

  //ajouter un nouveau libre à la collection : books
  addBook(book) {
    this.books.push(book);
    this.saveBooks();
  }
  //retirer un livre de la collection à partir du titre
  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
    this.saveBooks();
  }
  //mettre à jour un livre à partir du titre
  updateBook(oldTitle, newBook) {
    const index = this.books.findIndex((book) => book.title === oldTitle);
    if (index !== -1) {
      this.books[index] = newBook;
      this.saveBooks();
    }
  }
  //Retourner une liste de livres qui reponds à la recherche
  searchBooks(query) {
    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
  }

  //retourner une liste de livres qui ont été lu
  filterBooks(isRead) {
    return this.books.filter((book) => book.isRead === isRead);
  }

  //sauvegarder la liste de livres dans la memoire local du navigateur
  saveBooks() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }

  //chargement des données sauvegardés
  loadBooks() {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    }
  }
}

// Classe UI
class UI {
  //Afficher tous les livres de la bibliothèque
  static displayBooks(books) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
    books.forEach((book) => UI.addBookToList(book));
  }

  //afficher les livres dans le DOM
  static addBookToList(book) {
    const bookList = document.getElementById("bookList");
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.innerHTML = `
          <h3 class="title">${book.title}</h3>
          <p class="author"><strong>Auteur:</strong> ${book.author}</p>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <p><strong>Année:</strong> ${book.year}</p>
          <p><strong>Statut:</strong> ${book.isRead ? "Lu" : "Non lu"}</p>
          <button class="delete">Supprimer</button>
          <button class="edit">Modifier</button>
        `;
    bookList.appendChild(bookItem);
  }

  //Suprimer un livre sur l'affichage
  static deleteBookFromList(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.remove();
    }
  }

  //reinitialiser le formulaire d'ajout de livre
  static clearForm() {
    document.getElementById("bookForm").reset();
  }

  //afficher une alerte après une action
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#bookForm");
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

// Initialisation ----- MAIN -----
const library = new Library();
library.loadBooks();
UI.displayBooks(library.books);

// Main: Ajouter un livre après soumission
document.getElementById("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const year = document.getElementById("year").value;
  const isRead = document.getElementById("isRead").checked;
  //verifier si tous les champs sont remplir
  if (title && author && genre && year) {
    const book = new Book(title, author, genre, year, isRead);
    //ajouter le livre dans la librairie
    library.addBook(book);
    //afficher le livre dans DOM
    UI.addBookToList(book);
    //vider le formulaire
    UI.clearForm();
    //afficher une alerte pour l'ajout du livre
    UI.showAlert("Livre ajouté avec succès", "success");
  } else {
    UI.showAlert("Veuillez remplir tous les champs", "error");
  }
});

// Main: Supprimer/Modifier un livre à partir du titre
document.getElementById("bookList").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const title = e.target.parentElement.querySelector(".title").textContent;
    library.removeBook(title);
    UI.displayBooks(library.books);
    UI.showAlert("Livre supprimé", "success");
  }
  if (e.target.classList.contains("edit")) {
    const bookItem = e.target.parentElement;
    const title = bookItem.querySelector(".title").textContent;
    const book = library.books.find((b) => b.title === title);

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("year").value = book.year;
    document.getElementById("isRead").checked = book.isRead;

    library.removeBook(title);
    bookItem.remove();
  }
});

// Main : Rechercher le titre donné
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchQuery").value;
  const filteredBooks = library.searchBooks(query);
  UI.displayBooks(filteredBooks);
  const searchIcon = document.querySelector(".search-icon");
  if (query.trim() !== "")
    document.getElementById("rset-search").style.display = "block";
});

//Main : reset la recherche
document.getElementById("rset-search").addEventListener("click", (e) => {
  document.getElementById("searchQuery").value = "";
  UI.displayBooks(library.books);
  e.target.style.display = "none";
});

// Event: Filtrer les livres non lus
document.getElementById("filterUnreadBtn").addEventListener("change", (e) => {
  if (e.target.checked) {
    const unreadBooks = library.filterBooks(false);
    UI.displayBooks(unreadBooks);
  } else {
    UI.displayBooks(library.books);
  }
});

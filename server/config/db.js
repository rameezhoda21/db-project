export const db = {
  students: [
    { erpId: "S123", password: "123", name: "Ali", borrowed: [], fines: 0 },
    { erpId: "S456", password: "456", name: "Sara", borrowed: [], fines: 50 },
  ],
  librarians: [
    { username: "lib1", password: "lib123", name: "Librarian A" },
    { username: "lib2", password: "lib456", name: "Librarian B" },
  ],
  books: [
    { id: 1, title: "Database Systems", author: "Connolly", copies: 2 },
    { id: 2, title: "Operating Systems", author: "Silberschatz", copies: 0 },
    { id: 3, title: "Clean Code", author: "Robert Martin", copies: 3 },
  ],
};

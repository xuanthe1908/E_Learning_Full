# Hướng dẫn sửa báo cáo TranDucManh2 (Word)

Mở file **Word gốc** → `Ctrl+H` (Find and Replace) → thực hiện **theo thứ tự từ trên xuống**.

---

## A. Find & Replace nhanh (Copy → Paste)

| Tìm (Find) | Thay (Replace) |
|------------|----------------|
| `comprehensive online learning platform that connects teachers and students` | `comprehensive online course marketplace that connects instructors and students` |
| `proposed online learning platform` | `proposed online course marketplace` |
| `E-Learning system` | `Online course marketplace system` |
| `E-Learning website` | `Online course marketplace web application` |
| `e-learning platform` | `online course marketplace` |
| `online learning platform` | `online course marketplace` |
| `Payment gateway (future requirement)` | `Payment gateway integration (VNPay — implemented)` |
| `containerized using MongoDB` | `containerized using Docker` |
| `Response caching strategy with MongoDB` | `Response caching strategy with Redis` |
| `React Query for state management and API interaction, Redux for global state management` | `Redux Toolkit for global state management and API interaction` |
| `React Query for state management` | `Redux Toolkit for state management` |
| `State Management: Redux Toolkit with RTK Query` | `State Management: Redux Toolkit` |
| `Build Tools: Vite.js for faster development and optimized builds` | `Build Tools: Create React App (react-scripts) for development and production builds` |
| `Front-end development using React, React Native, Nx React and relevant frameworks` | `Front-end development using React.js and relevant frameworks` |
| `gpt-4.0-turbo` | `gpt-4o-mini` |
| `GPT-4.0 Turbo` | `GPT-4o mini` |
| `Muiltilingual` | `Multilingual` |
| `earch box` | `search box` |
| `metricscourses` | `metrics, courses` |

---

## B. Sửa đoạn Architecture (Chương 1 — mục 2)

**Tìm và thay cả đoạn:**

**TÌM:**
```
For the backend, I've adopted a microservices architecture where discrete services handle specific functionalities like authentication, course management, and assessment processing—each benefiting from TypeScript's strong typing for API contracts. Data persistence utilizes a hybrid approach with relational databases for structured user and course data, document stores for unstructured learning materials, and caching mechanisms for performance optimization.
```

**THAY:**
```
For the backend, I've adopted a layered monolithic architecture (Clean Architecture) where the Express server is organized into routes, controllers, use cases, and repositories. Data persistence utilizes MongoDB as the primary document database for users, courses, and transactions, with Redis for caching search results and optimizing API performance.
```

---

## C. Thay mục 1.3 ViteJS → Create React App (Chương 2)

**Đổi tiêu đề:** `1.3. ViteJS` → `1.3. React (Create React App)`

**Thay nội dung mục 1.3 bằng:**

```
1.3. React (Create React App)

Figure 3. React Development Environment

Create React App (CRA) is an officially supported toolchain for building single-page React applications. It provides a pre-configured development environment with react-scripts, enabling developers to focus on application logic rather than build configuration. The TutorTrek frontend uses CRA with TypeScript, React 18, and Tailwind CSS.

Advantages of Create React App:
- Zero-configuration setup for React and TypeScript projects
- Built-in development server with hot reloading
- Optimized production builds with code splitting
- Wide community support and stable ecosystem for e-learning and marketplace applications

Disadvantages of Create React App:
- Less flexible than custom bundlers (e.g., Vite) for advanced optimization
- Build times may increase as the project grows
- Ejecting is irreversible if full control over Webpack is needed

For this online course marketplace project, CRA provides a reliable and maintainable foundation suitable for a graduation-level full-stack application.
```

*(Giữ Figure 3 hoặc đổi caption thành "React / CRA Development Environment")*

---

## D. Sửa trích dẫn trong Chương 2

Sau khi REFERENCES mới là [1]–[10], sửa cite trong thân bài:

| Đoạn | Sửa cite thành |
|------|----------------|
| TypeScript `[1]` | Giữ `[1]` ✅ |
| Vite `[2]`, `[3]` | **Xóa** `[2]` và `[3]` ở đoạn Vite (đã xóa mục Vite) |
| MongoDB `data [4]` | `data [5]` |
| Redis `scenarios [4]` | `scenarios [7]` |
| Redis `matter [5]` | `matter [7]` |
| Redis `requests [6]` | `requests [7]` |

---

## E. REFERENCES — tách [8] và [9]

**TÌM (dính một dòng):**
```
Available: https://datatracker.ietf.org/doc/html/rfc7519 [9] R. C. Martin,
```

**THAY:**
```
Available: https://datatracker.ietf.org/doc/html/rfc7519

[9] R. C. Martin,
```

---

## F. Acknowledgments — sửa nhanh

- `you provided` → `he provided` (nếu nói về thầy)
- `coupled with your enthusiastic` → `coupled with his enthusiastic`
- Xóa dòng chỉ có dấu `.` thừa (trang 4)

---

## G. Export PDF

1. File → Save As → `TranDucManh3.pdf`
2. Kiểm tra: title bìa, IR-004, không còn "Vite" / "React Query" / "microservices" (Ctrl+F)

---

## H. Checklist cuối (Ctrl+F trong Word)

- [ ] `Vite` — 0 kết quả (hoặc chỉ trong Disadvantages so sánh)
- [ ] `React Query` — 0
- [ ] `React Native` — 0
- [ ] `microservices` — 0
- [ ] `future requirement` — 0 (payment)
- [ ] `gpt-4.0` — 0
- [ ] `E-Learning system` — 0
- [ ] `online course marketplace` — xuất hiện nhiều ✅

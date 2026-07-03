"""
Apply text fixes to TranDucManh2.pdf and save TranDucManh3.pdf
Requires: pip install pymupdf
"""
import sys
from pathlib import Path

try:
    import fitz  # pymupdf
except ImportError:
    print("Installing pymupdf...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf", "-q"])
    import fitz

INPUT_PDF = Path(r"d:\Downloads\TranDucManh2.pdf")
OUTPUT_PDF = Path(r"d:\Downloads\TranDucManh3.pdf")

# Order matters: longer phrases first to avoid partial replacements
REPLACEMENTS = [
    ("comprehensive online learning platform that connects teachers and students",
     "comprehensive online course marketplace that connects instructors and students"),
    ("proposed online learning platform", "proposed online course marketplace"),
    ("the proposed online learning platform", "the proposed online course marketplace"),
    ("Building a Website for E-Learning using TypeScript",
     "Design and Implementation of an Online Course Marketplace"),
    ("E-Learning system", "Online course marketplace system"),
    ("E-Learning website", "Online course marketplace web application"),
    ("e-learning platform", "online course marketplace"),
    ("e-learning projects", "online course marketplace projects"),
    ("e-learning applications", "online course marketplace applications"),
    ("e-learning features", "online course marketplace features"),
    ("e-learning ecosystems", "online course marketplace ecosystems"),
    ("e-learning design", "online course marketplace design"),
    ("e-learning platform", "online course marketplace"),
    ("online learning platform", "online course marketplace"),
    ("Payment gateway (future requirement)", "Payment gateway integration (VNPay — implemented)"),
    ("containerized using MongoDB", "containerized using Docker"),
    ("Response caching strategy with MongoDB", "Response caching strategy with Redis"),
    ("React Query for state management and API interaction, Redux for global state management",
     "Redux Toolkit for global state management and API interaction"),
    ("React Query for state management", "Redux Toolkit for state management"),
    ("State Management: Redux Toolkit with RTK Query",
     "State Management: Redux Toolkit"),
    ("Build Tools: Vite.js for faster development and optimized builds",
     "Build Tools: Create React App (react-scripts) for development and production builds"),
    ("Front-end development using React, React Native, Nx React and relevant frameworks",
     "Front-end development using React.js and relevant frameworks"),
    ("I've adopted a microservices architecture where discrete services handle specific functionalities like authentication, course management, and assessment processing—each benefiting from TypeScript's strong typing for API contracts. Data persistence utilizes a hybrid approach with relational databases for structured user and course data, document stores for unstructured learning materials, and caching mechanisms for performance optimization.",
     "I've adopted a layered monolithic architecture (Clean Architecture) where the Express server is organized into routes, controllers, use cases, and repositories. Data persistence utilizes MongoDB as the primary document database for users, courses, and transactions, with Redis for caching search results and JWT refresh token storage."),
    ("For the backend, I've adopted a microservices",
     "For the backend, I've adopted a layered monolithic"),
    ("relational databases for structured user and course data, document stores for unstructured learning materials, and caching mechanisms",
     "MongoDB for document-based storage of users and courses, and Redis caching mechanisms"),
    ("gpt-4.0-turbo", "gpt-4o-mini"),
    ("GPT-4.0 Turbo", "GPT-4o mini"),
    ("Muiltilingual", "Multilingual"),
    ("earch box", "search box"),
    ("metricscourses", "metrics, courses"),
    ("Available: https://datatracker.ietf.org/doc/html/rfc7519 [9] R. C. Martin,",
     "Available: https://datatracker.ietf.org/doc/html/rfc7519\n\n[9] R. C. Martin,"),
    # Fix inline citations after REFERENCES renumbering (Ch.2 body)
    ("NodeJS) [1].", "NodeJS) [1]."),
    ("transpilation [2].", "transpilation."),
    ("e-learning tools or libraries [3]", "frontend build tools or libraries"),
    ("data [4].", "data [5]."),
    ("scenarios [4].", "scenarios [7]."),
    ("matter [5].", "matter [7]."),
    ("requests [6].", "requests [7]."),
]

# Vite section title replacement (keep figure, update heading text if found)
VITE_TITLE_REPLACEMENTS = [
    ("1.3. ViteJS", "1.3. React (Create React App)"),
    ("ViteJS", "Create React App"),
    ("Vite.js", "Create React App"),
    ("Vite React", "Create React App"),
    ("Vite is a modern web application development",
     "Create React App (CRA) is a officially supported toolchain for building React applications"),
]


def replace_text_on_page(page: fitz.Page, old: str, new: str) -> int:
    count = 0
    text_instances = page.search_for(old)
    for rect in text_instances:
        # Redact old text and insert new
        page.add_redact_annot(rect, text=new, fill=(1, 1, 1))
        count += 1
    return count


def main():
    if not INPUT_PDF.exists():
        print(f"ERROR: Input not found: {INPUT_PDF}")
        sys.exit(1)

    doc = fitz.open(INPUT_PDF)
    total = 0
    all_replacements = REPLACEMENTS + VITE_TITLE_REPLACEMENTS

    for page_num in range(len(doc)):
        page = doc[page_num]
        for old, new in all_replacements:
            if old == new:
                continue
            n = replace_text_on_page(page, old, new)
            if n:
                total += n
                print(f"  Page {page_num + 1}: '{old[:50]}...' -> {n} hit(s)")
        page.apply_redactions()

    doc.save(OUTPUT_PDF, garbage=4, deflate=True)
    doc.close()
    print(f"\nDone. {total} replacements applied.")
    print(f"Saved: {OUTPUT_PDF}")


if __name__ == "__main__":
    main()

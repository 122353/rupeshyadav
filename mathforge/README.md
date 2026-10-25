# EigenPath — Mathematics Studio

A responsive, zero-build static web application for one unified mathematics curriculum: linear algebra, IPU Unit III/IV exam preparation, mathematical foundations for deep learning, and advanced research reading.

## Features
- 61 structured lessons across 6 stages, with intuitions, formulas, worked numerical examples, and misconceptions.
- Two different practice lenses for each lesson: university-style computation and deep-learning interpretation.
- Independent IPU, DL, and research quizzes with explanations.
- Three interactive labs: 2D matrix transformations, scalar gradient descent, and backpropagation through a sigmoid neuron.
- Local progress, notes, checkpoint completion, searchable lessons, eight-week study plan, and standard references.
- Responsive static HTML/CSS/JavaScript with no API credentials and no database.

## Run locally
Open `mathforge/index.html` in your browser, or run a static server from `mathforge` using `python -m http.server 8000`.

## Deploy to Vercel
Import repository `122353/rupeshyadav` from GitHub and create a **new** Vercel project. Set **Root Directory** to `mathforge`. Select **Other / No Framework**, no build command, and no environment variables. Deploy. Future pushes to `main` auto-deploy after Git integration.

### Caveats
- Not affiliated with IPU; please confirm the Unit III/IV coverage against your latest official syllabus and adapt the learning plan as needed.
- Practice exercises are original *style-matched* examples, not verbatim textbook problems or verified previous-year exam questions.
- Progress and notes are device-local; switching browsers or clearing storage loses them. Use Export for a backup. Import/sync is not yet provided.
- The app does not include accounts, a hosted backend, online grading or code execution.
- External academic sources have their own licensing and availability.

## Curriculum
1. Visual foundations: vectors, matrix operations, transformations, determinants.
2. IPU Unit III: elimination, echelon forms, ranks, linear systems, spaces, bases, eigenvalues, diagonalization.
3. Deep geometry: orthogonality, least squares, SVD, PCA, numerical stability.
4. IPU Unit IV: partial derivatives, vector fields, curves, divergence/curl, multiple integrals, Green/Stokes/Gauss.
5. DL math: tensors, matrix calculus, Jacobians, backpropagation, optimization, attention, LoRA.
6. Research: Hessians, autodiff, structured matrices, graph Laplacians, NTK, randomized SVD and information geometry.

Built with vanilla HTML/CSS/JS for fast static Vercel hosting.
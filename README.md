# United Server - Multi-Service Architecture

JWT 기반 마이크로서비스 아키텍처 학습 프로젝트

## 아키텍처

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│  Auth (DRF) │     │Blog (FastAPI)│
│  Frontend   │     │   JWT 발급   │     │  JWT 검증    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                    │
       └───────────────────┴────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │  (Schemas)  │
                    └─────────────┘
```

## 기술 스택

- **Auth Service**: Django 5.x + DRF + SimpleJWT (Port 8000)
- **Blog Service**: FastAPI + SQLAlchemy + PyJWT (Port 8001)
- **Frontend**: React 18 + Vite + Tailwind CSS (Port 5173)
- **Database**: PostgreSQL 16 (스키마 분리)
- **Reverse Proxy**: Nginx (Production only)

## 빠른 시작

### 개발 환경

```bash
# 1. 환경 변수 확인 (이미 설정됨)
ls -la auth-service/.env.dev blog-service/.env.dev frontend/.env.dev

# 2. Docker Compose로 실행
docker compose -f compose.dev.yml up --build

# 3. 데이터베이스 마이그레이션 (첫 실행 시)
docker compose -f compose.dev.yml exec auth-service python manage.py migrate

# 4. 접속
# - Frontend: http://localhost:5173
# - Auth API: http://localhost:8000
# - Blog API: http://localhost:8001
```

### 프로덕션 환경

```bash
# 1. 프로덕션 환경 변수 수정
# auth-service/.env.prod, blog-service/.env.prod 수정 필요

# 2. Docker Compose로 실행
docker compose -f compose.prod.yml up --build -d

# 3. 데이터베이스 마이그레이션
docker compose -f compose.prod.yml exec auth-service python manage.py migrate

# 4. 접속
# - 모든 서비스: http://localhost (Nginx 통해)
```

## API 엔드포인트

### Auth Service (DRF)
- `POST /api/token/` - JWT 토큰 발급
- `POST /api/token/refresh/` - 토큰 갱신
- `POST /api/token/verify/` - 토큰 검증
- `POST /api/users/register/` - 회원가입
- `GET /api/users/profile/` - 프로필 조회

### Blog Service (FastAPI)
- `GET /api/posts/` - 게시글 목록 (공개)
- `GET /api/posts/{id}` - 게시글 상세 (공개)
- `POST /api/posts/` - 게시글 작성 (인증 필요)
- `PUT /api/posts/{id}` - 게시글 수정 (인증 필요)
- `DELETE /api/posts/{id}` - 게시글 삭제 (인증 필요)
- `GET /api/posts/user/me` - 내 게시글 목록 (인증 필요)

## 환경 설정

### 개발 환경 (.env.dev)
- 모든 포트 노출 (5432, 8000, 8001, 5173)
- 소스 코드 볼륨 마운트 (핫 리로드)
- DEBUG=True
- 개발용 시크릿 키

### 프로덕션 환경 (.env.prod)
- Nginx 포트 80만 노출
- 볼륨 마운트 없음
- DEBUG=False
- Gunicorn (DRF) + Uvicorn Workers (FastAPI)
- 강력한 시크릿 키 필요

## 주요 파일 구조

```
united-server/
├── auth-service/           # Django REST Framework 인증 서비스
│   ├── auth_project/       # Django 프로젝트 설정
│   ├── users/              # 사용자 앱
│   ├── .env.dev           # 개발 환경 변수
│   ├── .env.prod          # 프로덕션 환경 변수
│   ├── Dockerfile.dev     # 개발용 Docker
│   └── Dockerfile.prod    # 프로덕션용 Docker
├── blog-service/           # FastAPI 블로그 서비스
│   ├── app/               # FastAPI 애플리케이션
│   ├── alembic/           # 데이터베이스 마이그레이션
│   ├── .env.dev           # 개발 환경 변수
│   ├── .env.prod          # 프로덕션 환경 변수
│   ├── Dockerfile.dev     # 개발용 Docker
│   └── Dockerfile.prod    # 프로덕션용 Docker
├── frontend/               # React 프론트엔드
│   ├── src/               # 소스 코드
│   ├── .env.dev           # 개발 환경 변수
│   ├── .env.prod          # 프로덕션 환경 변수
│   ├── Dockerfile.dev     # 개발용 Docker
│   └── Dockerfile.prod    # 프로덕션용 Docker
├── nginx/                  # 프로덕션 리버스 프록시
│   ├── nginx.conf
│   └── Dockerfile
├── compose.dev.yml         # 개발 Docker Compose
├── compose.prod.yml        # 프로덕션 Docker Compose
├── init-db.sql            # 스키마 초기화 SQL
└── CLAUDE.md              # 프로젝트 가이드
```

## 인증 흐름

1. **회원가입**: React → DRF `/api/users/register/`
2. **로그인**: React → DRF `/api/token/` → Access + Refresh 토큰 반환
3. **API 요청**: React → FastAPI (Authorization: Bearer <token>)
4. **토큰 검증**: FastAPI가 같은 JWT_SECRET_KEY로 토큰 검증
5. **토큰 갱신**: React → DRF `/api/token/refresh/`

## 중요 사항

- **JWT_SECRET_KEY는 Auth Service와 Blog Service에서 반드시 동일해야 함**
- `.env.dev`와 `.env.prod` 파일은 절대 커밋하지 않음 (.gitignore에 포함)
- 프로덕션에서는 모든 시크릿 키를 강력한 무작위 값으로 변경
- PostgreSQL은 같은 데이터베이스 내 다른 스키마를 사용 (auth_schema, blog_schema)

## 학습 목표

- 환경 분리 (개발/프로덕션)
- JWT 토큰 발급 및 크로스 서비스 검증
- Docker Compose 멀티 환경 구성
- Nginx 리버스 프록시 설정
- 마이크로서비스와 공유 인증

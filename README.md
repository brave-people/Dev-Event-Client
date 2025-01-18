# Dev Event Client`(Admin)`

<div align="center">
  <img width="980" alt="Dev Event Admin Screenshot" src="https://user-images.githubusercontent.com/39582981/235683244-d5421502-2723-4f76-8818-f610d67ac654.png">

  <h3>개발자 행사 관리를 위한 관리자 서비스</h3>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a>
  </p>
</div>

<br />

## Features

- 📅 개발자 행사 등록 및 관리
- 🔍 마크다운 기반 행사 정보 파싱
- 👥 관리자 권한 기반 접근 제어
- 🖼️ 행사 커버 이미지 관리
- 🏷️ 태그 기반 행사 분류

<br />

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) (v13.4) - React 프레임워크
- [React](https://reactjs.org/) (v18.2) - UI 라이브러리
- [TypeScript](https://www.typescriptlang.org/) (v5.1) - 정적 타입 지원
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크

### State Management
- [Jotai](https://jotai.org/) (v2.0) - 프리미티브하고 유연한 상태 관리

### Development Tools
- [pnpm](https://pnpm.io/) - 빠르고 디스크 효율적인 패키지 매니저

<br />

## Getting Started

### Installation
```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# Tailwind CSS 빌드
pnpm tailwind
```

### Environment Variables`(.env)`
```env
NEXT_PUBLIC_API_URL=your_api_url
```

<br />

## Project Structure

```
src/
├── api/          # API 통신 관련 로직
├── app/          # Next.js 13 App Router
├── components/   # React 컴포넌트
│   ├── atoms/    # 기본 UI 컴포넌트
│   ├── molecules/# 복합 컴포넌트
│   ├── organisms/# 비즈니스 로직 컴포넌트
│   └── templates/# 페이지 레이아웃
├── model/        # 타입 정의
├── store/        # Jotai 상태 관리
├── style/        # 글로벌 스타일
└── util/         # 유틸리티 함수
```

<br />

## 배포 이력

https://github.com/brave-people/Dev-Event-Client/wiki

<br />

<div align=center>
  <hr />
    <h3> 용감한 친구들 with 남송리 삼번지 </h3>
  <hr />
</div>


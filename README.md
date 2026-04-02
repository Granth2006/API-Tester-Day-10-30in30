<div align="center">

<img src="https://img.shields.io/badge/Day-10%20%2F%2030-339af0?style=for-the-badge&logo=calendar&logoColor=white" />
<img src="https://img.shields.io/badge/API_Testing-339af0?style=for-the-badge&logo=postman&logoColor=white" />
<img src="https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" />

<br /><br />

# 🚀 API Tester (Mini Postman)

### A lightweight, vanilla JavaScript API testing application natively built in the browser to craft requests, analyze responses, and manage collections.

<br/>

[![🚀 Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-api--tester-339af0?style=for-the-badge)](https://api-tester-day-10.vercel.app/)
&nbsp;&nbsp;
[![GitHub](https://img.shields.io/badge/⭐%20GitHub-Granth2006-24292e?style=for-the-badge&logo=github)](https://github.com/Granth2006)

</div>

---

## ⚙️ Features

<table>
  <tr>
    <td width="50%">
      <h3>🛠️ Request Builder</h3>
      Send GET, POST, PUT, DELETE, and PATCH requests. Complete with key-value editors for Headers, query parameters, and a JSON body editor with automatic validation.
    </td>
    <td width="50%">
      <h3>🔍 Response Viewer</h3>
      Real-time inspection of API responses. Displays accurate status highlights, time (in ms), bytes received, alongside syntax-highlighted (Prism.js) pretty-printed JSON.
    </td>
  </tr>
  <tr>
    <td>
      <h3>💾 History & Collections</h3>
      A sidebar automatically tracks your 10 most recent API queries. Save and label crucial endpoint configurations persistently to Collections.
    </td>
    <td>
      <h3>🔧 Environment Variables</h3>
      Dynamically replace text on-the-fly. Define keys like <code>base_url</code> once, and seamlessly integrate them into URLs/bodies via the <code>{{base_url}}</code> syntax.
    </td>
  </tr>
</table>

---

## 🔐 Privacy First

> **Your APIs, Your Business.**
> This app functions entirely in-browser using standard Fetch API. Histories, collections, and variable endpoints are stored securely in your browser's local sandbox (`localStorage`) and are never tracked remotely.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | Structure & markup |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Styling — vanilla, no frameworks (incl. Dark/Light Modes) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | All logic, client-side only (ES6 Modules) |
| `Prism.js` | JSON payload syntax highlighting |
| ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat&logo=vercel&logoColor=white) | Hosting & deployment |

---

## 📋 Project Info

| | |
|---|---|
| 🏆 **Challenge** | 30 Web Apps in 30 Days |
| 📅 **Day** | Day 10 / 30 |
| 👤 **Author** | Granth |
| 🌐 **Live URL** | [https://api-tester-day-10.vercel.app/](https://api-tester-day-10.vercel.app/) |
| 🛠️ **Build** | No build step — pure HTML / CSS / JS |
| 📄 **License** | MIT |

---

<details>
<summary>📁 File Structure</summary>

```
10/
├── index.html     # Main HTML structure and UI
├── style.css      # Core application styles and color themes
├── app.js         # Entrypoint module handling events and UI bindings
└── modules/       
    ├── request.js # Core network abstraction via Fetch API
    ├── ui.js      # Layout and display interactions abstraction
    └── storage.js # Caching and persistence mechanisms
```

</details>

---

<div align="center">

Built by **[Granth](https://github.com/Granth2006)** &nbsp;·&nbsp; Part of the **30 Web Apps in 30 Days** challenge

[![Live Demo](https://img.shields.io/badge/🚀%20Open%20Live%20Demo-339af0?style=for-the-badge)](https://api-tester-day-10.vercel.app/)

</div>

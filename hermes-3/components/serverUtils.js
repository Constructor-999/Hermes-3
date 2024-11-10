import { JSDOM } from "jsdom";

function parseCalendarRow(trElement) {
  const tdElements = trElement.querySelectorAll("td");
  const rowData = [];

  tdElements.forEach((td) => {
    if (td.classList.contains("label")) {
      return;
    }

    const lectureDivs = td.querySelectorAll(".lecture");

    if (lectureDivs.length > 0) {
      const lectures = [];

      lectureDivs.forEach((lectureDiv) => {
        const lectureInfo = {};

        const subject = lectureDiv.querySelector(".dis");
        if (subject) lectureInfo.subject = subject.textContent.trim();

        const className = lectureDiv.querySelector(".classe");
        if (className) lectureInfo.className = className.textContent.trim();

        const teacherAnchor = lectureDiv.querySelector(".keys a");
        if (teacherAnchor) {
          lectureInfo.teacher = {
            name: teacherAnchor.textContent.trim(),
            profileUrl: teacherAnchor.getAttribute("href"),
          };
        }

        const roomSpans = lectureDiv.querySelectorAll(".room span");
        const rooms = [];
        roomSpans.forEach((span) => {
          const roomText = span.textContent.trim();
          if (roomText) {
            rooms.push(roomText);
          }
        });

        lectureInfo.room = rooms.length > 0 ? rooms : [];

        lectures.push(lectureInfo);
      });

      rowData.push({ lectures, blank: false });
    } else {
      rowData.push({ blank: true });
    }
  });

  return rowData;
}

function parseTable(tableElement) {
  const trElements = tableElement.querySelectorAll("tr");
  const tableData = [];

  for (let i = 1; i < trElements.length; i++) {
    const tr = trElements[i];
    const rowData = parseCalendarRow(tr);
    if (rowData.length > 0) {
      tableData.push(rowData);
    }
  }

  return tableData;
}

function findTableInHTML(rawHTML) {
  const dom = new JSDOM(rawHTML);
  const document = dom.window.document;

  const tableElement = document.querySelector("body > div > main table");

  if (!tableElement) {
    return null;
  }

  return tableElement;
}

const parseHTML = (rawHTML) => {
  const tableElement = findTableInHTML(rawHTML);
  if (tableElement) {
    const lectureData = parseTable(tableElement);
    return lectureData;
  }
  return [];
};

export { parseHTML };
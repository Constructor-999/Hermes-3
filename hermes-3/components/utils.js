
const getTodaySubjects = (data) => {
  
  const subjectsSet = new Set();

  data.forEach((week) => {
    week.forEach((day) => {
      if (day.lectures) {
        day.lectures.forEach((lecture) => {
          if (lecture.subject) {
            subjectsSet.add(lecture.subject.trim());
          }
        });
      }
    });
  });

  const subjectArray = Array.from(subjectsSet).map((subject) => ({
    subject,
    color: "#bb999c",
  }));

  return subjectArray;
}

const databaseSearchEngine = (keyword, maxResultsPerCategory, data) => {
  const lowerKeyword = keyword.toLowerCase().trim();

  const processedKeyword = lowerKeyword.replace(/\s+/g, '');

  const formattedResults = [];

  function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, '');
  }

  function searchChildren(children, category) {
    const matchedItems = [];
    children.forEach(item => {
      const normalizedText = normalizeText(item.text);

      if (normalizedText.includes(processedKeyword)) {
        if (matchedItems.length < maxResultsPerCategory) {
          matchedItems.push({ id: item.id, text: item.text });
        }
      }
    });

    if (matchedItems.length > 0) {
      formattedResults.push({ name: category, data: matchedItems });
    }
  }

  data.results.forEach(topItem => {
    if (topItem.children) {
      let category = topItem.id;
      if (category === "klass") {
        if (topItem.text === "Horaire des élèves de la classe") {
          category = "klass_eleve";
        } else if (topItem.text === "Horaire des maîtres enseignant à la classe") {
          category = "klass_maitre";
        }
      }
      searchChildren(topItem.children, category);
    }
  });

  return formattedResults;
};



export { getTodaySubjects, databaseSearchEngine };

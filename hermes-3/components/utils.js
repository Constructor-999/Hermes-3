function getTodaySubjects (data) {
    const subjectsSet = new Set();
  
    data.forEach(week => {
      week.forEach(day => {
        if (day.lectures) {
          day.lectures.forEach(lecture => {
            if (lecture.subject) {
              subjectsSet.add(lecture.subject.trim());
            }
          });
        }
      });
    });
  
    const subjectArray = Array.from(subjectsSet).map(subject => ({
      subject,
      color: "#bb999c"
    }));
  
    return subjectArray;
  }

export { getTodaySubjects }
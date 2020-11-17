const formatter = new Intl.DateTimeFormat("fi-FI");

const formatDate = (date: Date) => formatter.format(date);

export default formatDate;

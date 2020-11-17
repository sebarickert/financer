const formatter = new Intl.DateTimeFormat("fi-FI");

const formatDate = (date: Date) => formatter.format(new Date(date));

export default formatDate;

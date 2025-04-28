//dd-mm-yyyy input -> string ;
export const transferStringToDateCheckToDay = (typeString) => {
  const [day, month, year] = typeString.split("-");
  //   console.log(day, month, year);
  const newDate = new Date(year, month - 1, day);
  const today = new Date();
  // am thi truoc, duong thi sau
  // console.log("Truoc ngay hien tai?: ", newDate.getTime() - today.getTime());
  return newDate.getTime() - today.getTime() > 0;
};

//date and time all string format ("dd-mm--yyyy")
export const convertTimestamp_DateTime = (date, time) => {
  //input Date and Time in string
  const [dA, mA, yA] = date.split("-").map(Number); //("dd-mm--yyyy") -> [dd, mm, yyyy]
  const newDate = new Date(yA, mA - 1, dA);
  const [h, m, s] = time.split(":").map(Number); //("h:m:s") ->[h,m,s]
  newDate.setHours(h, m, s);
  return newDate.getTime();

  //another way
  // because format of ISO time is: "yyyy-mm-ddThh:mm:ss"
  //return new Date(date.split("-").reverse.join(-) + "T" + time);
};

export const handleRedirect = (url, nav) => {
  const isInternalRoute = url.startsWith("/");
  if (isInternalRoute) {
    nav(url);
  } else {
    window.location.href = url;
  }
};

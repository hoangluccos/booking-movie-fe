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

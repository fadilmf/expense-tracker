export const useGetUserInfo = () => {
  if (typeof window !== "undefined") {
    const authDataString = localStorage.getItem("auth");

    if (authDataString) {
      const { name, profilePhoto, userID, isAuth } = JSON.parse(authDataString);

      return { name, profilePhoto, userID, isAuth };
    }
  }
  return { name: "", profilePhoto: "", userID: "", isAuth: false };
  //   const { name, profilePhoto, userID, isAuth } = JSON.parse(
  //     localStorage.getItem("auth")
  //   );

  //   return {name, profilePhoto, userID, isAuth}
};

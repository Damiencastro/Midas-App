






// createUsername(userProfile: UserModel){
//     console.log(userProfile)
//     const candidateUsername = UserDisplayUtils.formatUsername(userProfile);
//     this.checkUsername(candidateUsername).then((isAvailable) => {
//       if(isAvailable){
//         userProfile.username = candidateUsername;
//       } else {
//         userProfile.username = candidateUsername + Math.random();
//         return 
//       }
//     });
//     console.log(userProfile);
//     return userProfile.username;
//   }

//   checkUsername(candidateUsername: string): Promise<boolean> {
//     return firstValueFrom(this.getAllUsersWhere('username', '==', candidateUsername)).then(users => {
//       return users.length === 0;
//     });
//   }

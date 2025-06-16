package org.example;

public class UserManager {
    private final UserDatabase userdatabase = new UserDatabase();
    public String getUserInfo(){
        return userdatabase.getUserDetails();
    }
}

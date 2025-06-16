package com.looseCoupling;

public class TightCoupling {
    public static void main(String[] args) {
        UserManager um = new UserManager();
        System.out.println(um.getUserInfo());
    }
}
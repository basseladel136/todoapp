package com.todoapp.utils;

import java.util.Random;

public class TestFactory {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                    "abcdefghijklmnopqrstuvwxyz" +
                    "0123456789";

    private static final Random random = new Random();

    public static String generateRandomString(int length) {

        char[] chars = new char[length];

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            chars[i] = CHARACTERS.charAt(index);
        }

        return new String(chars);
    }

    public static String generateRandomEmail() {
        return generateRandomString(8) + "@test.com";
    }

    public static String generateRandomFirstName() {
        return generateRandomString(6);
    }

    public static String generateRandomLastName() {
        return generateRandomString(6);
    }

    public static String generateRandomTodo() {
        return "Todo_" + generateRandomString(8);
    }

    public static String generateRandomPassword() {
        return "Pass@" + generateRandomString(8) + "1A";
    }
}
package com.todoapp.tests;

import com.todoapp.pages.LoginPage;
import com.todoapp.pages.RegisterPage;
import com.todoapp.pages.TodoPage;
import com.todoapp.tests.base.BaseTest;
import com.todoapp.utils.TestFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class RegisterTest extends BaseTest {

    @Test
    public void ValidRegisterTest() {

        RegisterPage registerPage = new RegisterPage(driver);
        LoginPage loginPage = new LoginPage(driver);

        loginPage.clickCreateAccount();

        String firstName = TestFactory.generateRandomFirstName();
        String lastName = TestFactory.generateRandomLastName();
        String email = TestFactory.generateRandomEmail();
        String password = TestFactory.generateRandomPassword();

        System.out.println("=================================");
        System.out.println("Registration Data");
        System.out.println("First Name: " + firstName);
        System.out.println("Last Name: " + lastName);
        System.out.println("Email: " + email);
        System.out.println("Password: " + password);
        System.out.println("=================================");

        registerPage.fillFirstName(firstName);
        registerPage.fillLastName(lastName);
        registerPage.fillEmail(email);
        registerPage.fillPassword(password);
        registerPage.fillConfirmPassword(password);

        registerPage.clickCreateAccount();

        // Wait for Todo page
        WebDriverWait wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        wait.until(
                ExpectedConditions.urlContains("/todos")
        );

        TodoPage todoPage = new TodoPage(driver);

        // Verify Todo page is displayed
        wait.until(
                driver -> todoPage.isNoTodosMessageDisplayed()
        );

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/todos"),
                "User was not redirected to Todo page"
        );

        Assert.assertTrue(
                todoPage.isNoTodosMessageDisplayed(),
                "Todo page is not displayed correctly"
        );
    }


    @Test
    public void registerWithWeakPasswordTest() {

        LoginPage loginPage = new LoginPage(driver);
        RegisterPage registerPage = new RegisterPage(driver);

        // IMPORTANT: Go to Signup page first
        loginPage.clickCreateAccount();

        registerPage.fillFirstName("Bassel");
        registerPage.fillLastName("Adel");
        registerPage.fillEmail(TestFactory.generateRandomEmail());
        registerPage.fillPassword("123");
        registerPage.fillConfirmPassword("123");

        registerPage.clickCreateAccount();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/signup"),
                "User should remain on signup page"
        );
    }


    @Test
    public void registerWithMismatchedPasswordsTest() {

        LoginPage loginPage = new LoginPage(driver);
        RegisterPage registerPage = new RegisterPage(driver);

        // IMPORTANT: Go to Signup page first
        loginPage.clickCreateAccount();

        registerPage.fillFirstName("Bassel");
        registerPage.fillLastName("Adel");
        registerPage.fillEmail(TestFactory.generateRandomEmail());
        registerPage.fillPassword("Password@123");
        registerPage.fillConfirmPassword("Different@123");

        registerPage.clickCreateAccount();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/signup"),
                "User should remain on signup page"
        );
    }


    @Test
    public void registerWithEmptyFieldsTest() {

        LoginPage loginPage = new LoginPage(driver);
        RegisterPage registerPage = new RegisterPage(driver);

        // IMPORTANT: Go to Signup page first
        loginPage.clickCreateAccount();

        registerPage.clickCreateAccount();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/signup"),
                "User should remain on signup page"
        );
    }
}
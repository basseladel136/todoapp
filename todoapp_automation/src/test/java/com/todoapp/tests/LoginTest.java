package com.todoapp.tests;

import com.todoapp.pages.LoginPage;
import com.todoapp.tests.base.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginTest extends BaseTest {

    @Test
    public void validLoginTest() {

        LoginPage loginPage = new LoginPage(driver);

        loginPage.enterEmail("bassel@gmail.com");
        loginPage.enterPassword("Password@123");
        loginPage.clickSubmitButton();

        // Wait until Todo page is loaded
        WebDriverWait wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(10)
        );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector("[data-testid='welcome']")
                )
        );

        // Verify successful login
        Assert.assertTrue(
                driver.findElement(
                        By.cssSelector("[data-testid='welcome']")
                ).isDisplayed(),
                "Login failed - Welcome message is not displayed"
        );
    }


    @Test
    public void invalidEmailTest() {

        LoginPage loginPage = new LoginPage(driver);

        loginPage.enterEmail("invalid-email");
        loginPage.enterPassword("Password@123");
        loginPage.clickSubmitButton();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/login"),
                "User should remain on login page"
        );
    }


    @Test
    public void invalidPasswordTest() {

        LoginPage loginPage = new LoginPage(driver);


        loginPage.enterEmail("your-email@test.com");
        loginPage.enterPassword("WrongPassword@123");
        loginPage.clickSubmitButton();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/login"),
                "User should remain on login page"
        );
    }


    @Test
    public void emptyFieldsLoginTest() {

        LoginPage loginPage = new LoginPage(driver);

        loginPage.clickSubmitButton();

        Assert.assertTrue(
                driver.getCurrentUrl().contains("/login"),
                "User should remain on login page"
        );
    }
}
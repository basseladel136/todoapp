package com.todoapp.tests;

import com.todoapp.pages.LoginPage;
import com.todoapp.pages.TodoPage;
import com.todoapp.tests.base.BaseTest;
import com.todoapp.utils.TestFactory;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class TodoTest extends BaseTest {

    private TodoPage todoPage;


    @BeforeMethod
    public void loginBeforeTest() {

        LoginPage loginPage =
                new LoginPage(driver);

        loginPage.enterEmail("bassel@gmail.com");

        loginPage.enterPassword("Password@123");

        loginPage.clickSubmitButton();

        todoPage = new TodoPage(driver);
    }


    // =========================
    // Add Todo
    // =========================

    @Test
    public void addTodoTest() {

        String todo =
                TestFactory.generateRandomTodo();

        todoPage.addTodo(todo);

        Assert.assertTrue(
                todoPage.isTodoDisplayed(todo),
                "Todo was not added successfully"
        );
    }


    // =========================
    // Complete Todo
    // =========================

    @Test
    public void completeTodoTest() {

        String completedTodo = todoPage.completeRandomTodo();

        Assert.assertTrue(
                todoPage.isTodoCompleted(completedTodo),
                "Random Todo was not completed"
        );
    }


    // =========================
    // Delete Todo
    // =========================

    @Test
    public void deleteTodoTest() {

        String deletedTodo = todoPage.deleteRandomTodo();

        Assert.assertTrue(
                todoPage.isDeleteSuccessMessageDisplayed(),
                "Todo deleted message was not displayed"
        );

        Assert.assertTrue(
                todoPage.isTodoDeleted(deletedTodo),
                "Todo was not deleted"
        );
    }

    // =========================
    // Empty Todo
    // =========================

    @Test
    public void addEmptyTodoTest() {

        String emptyTodo = "";

        todoPage.enterTodo(emptyTodo);
        todoPage.clickAddTodo();

        Assert.assertFalse(
                todoPage.isTodoWithTextDisplayed(emptyTodo),
                "Empty todo should not be added"
        );
    }


}
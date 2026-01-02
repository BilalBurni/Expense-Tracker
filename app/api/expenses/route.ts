import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

// GET all expenses for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const expensesCollection = db.collection('expenses');

    const expenses = await expensesCollection
      .find({ userId })
      .sort({ date: -1 })
      .toArray();

    const formattedExpenses = expenses.map((exp) => ({
      id: exp._id.toString(),
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      description: exp.description,
    }));

    return NextResponse.json({ expenses: formattedExpenses }, { status: 200 });
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new expense
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const { title, amount, category, date, description } = await request.json();

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const expensesCollection = db.collection('expenses');

    const newExpense = {
      userId,
      title,
      amount: parseFloat(amount),
      category,
      date,
      description: description || '',
      createdAt: new Date(),
    };

    const result = await expensesCollection.insertOne(newExpense);

    const expense = {
      id: result.insertedId.toString(),
      title: newExpense.title,
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date,
      description: newExpense.description,
    };

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

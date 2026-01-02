import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if expense exists and belongs to user
    const expense = await expensesCollection.findOne({
      _id: new ObjectId(params.id),
      userId,
    });

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Update expense
    await expensesCollection.updateOne(
      { _id: new ObjectId(params.id), userId },
      {
        $set: {
          title,
          amount: parseFloat(amount),
          category,
          date,
          description: description || '',
          updatedAt: new Date(),
        },
      }
    );

    const updatedExpense = {
      id: params.id,
      title,
      amount: parseFloat(amount),
      category,
      date,
      description: description || '',
    };

    return NextResponse.json({ expense: updatedExpense }, { status: 200 });
  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if expense exists and belongs to user
    const expense = await expensesCollection.findOne({
      _id: new ObjectId(params.id),
      userId,
    });

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Delete expense
    await expensesCollection.deleteOne({
      _id: new ObjectId(params.id),
      userId,
    });

    return NextResponse.json(
      { message: 'Expense deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

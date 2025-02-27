"use client";

import React, { useState } from 'react';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ClassworkTab = ({ courseId, tasks }) => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskSort, setTaskSort] = useState('newest');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    points: 0,
    dueDate: '',
    type: 'assignment'
  });

  const handleCreateTask = async () => {
    try {
      // Implement task creation logic here
      console.log('Creating task:', newTask);
      // Reset form and close modal
      setIsCreateTaskModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        points: 0,
        dueDate: '',
        type: 'assignment'
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const filteredTasks = tasks?.filter(task => {
    if (taskFilter === 'all') return true;
    return task.type === taskFilter;
  }).sort((a, b) => {
    if (taskSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (taskSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (taskSort
 === 'due') return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div lassName="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Classwork</h2>
        <Dialog open={isCreateTaskModalOpen} onOpenChange={setIsCreateTaskModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input 
                  id="title" 
                  value={newTask.title}
               c   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea 
                  id="description" 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select 
                  value={newTask.type}
                  onValueChange={(value) => setNewTask({...newTask, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="material">Study Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">Points</Label>
                <Input 
                  id="points" 
                  type="number"
                  value={newTask.points}
                  onChange={(e) => setNewTask({...newTask, points: Number(e.target.value)})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="col-span-3" 
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateTaskModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-2 mb-4">
        <Select value={taskFilter} onValueChange={setTaskFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> 
                {taskFilter === 'all' ? 'All Tasks' : 
                 taskFilter === 'assignment' ? 'Assignments' : 
                 taskFilter === 'quiz' ? 'Quizzes' : 'Study Materials'}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="assignment">Assignments</SelectItem>
            <SelectItem value="quiz">Quizzes</SelectItem>
            <SelectItem value="material">Study Materials</SelectItem>
          </SelectContent>
        </Select>

        <Select value={taskSort} onValueChange={setTaskSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <div className="flex items-center">
                <SortAsc className="mr-2 h-4 w-4" /> 
                {taskSort === 'newest' ? 'Newest First' : 
                 taskSort === 'oldest' ? 'Oldest First' : 'Due Date'}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="due">Due Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div 
              key={task._id} 
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-500">
                    {task.points} Points
                  </span>
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No tasks have been created yet.</p>
          <p className="text-sm">Click "Create Task" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ClassworkTab;

import { useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect } from 'react';

function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([])
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      console.log(response.data)

      setFoods(response.data)
    }

    loadFoods()
  }, [])

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post("/foods", { ...food, available: true })

      setFoods([...foods, response.data])
      toggleModal()
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    const response = await api.put(`/foods/${editingFood.id}`, {
      ...food,
      available: editingFood.available
    })
    const foodsUpdated = [...foods]
    const findIndex = foodsUpdated.findIndex(
      (findFood) => findFood.id === editingFood.id
    )

    foodsUpdated[findIndex] = response.data

    setFoods(foodsUpdated)
    toggleEditModal()
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)
    setFoods(foods.filter((food) => food.id !== id))
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: Foods) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
}


export default Dashboard;

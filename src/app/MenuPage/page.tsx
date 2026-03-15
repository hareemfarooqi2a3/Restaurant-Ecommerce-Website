import React from 'react'
import ForAllHeroSections from '../../../components/ForAllHeroSections'
import StarterMenu from '../../../components/StarterMenu'
import Experience from '../../../components/HomePageExperience'
import MainCourse from '../../../components/MainCourse'
import DrinksOnMenu from '../../../components/DrinksOnMenu'
import PartnersAndClients from '../../../components/PartnersOnMenu'
import DesertsOnMenu from '../../../components/DesertsOnMenu'

export default function MenuPage() {
  return (
    <div className="main-content">
        <ForAllHeroSections />
        <StarterMenu />
        <MainCourse />
        <Experience />
        <DesertsOnMenu />
        <DrinksOnMenu />
        <PartnersAndClients />
    </div>
  )
}

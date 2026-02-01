from fastapi import HTTPException, status
from typing import List
from . import models
from datetime import datetime

async def create_new_project(request, database, current_user_id) -> models.Project:
    # Use current_user_id directly
    new_project = models.Project(
        title=request.title, 
        description=request.description,
        owner_id=current_user_id, 
        createdDate=datetime.now()
    )
    database.add(new_project)
    database.commit()
    database.refresh(new_project)
    return new_project

async def get_project_listing(database, current_user) -> List[models.Project]:
    """
    Fetches all projects owned by the current user.
    """
    # Fix: current_user is the string ID, not an object with an .id property.
    projects = database.query(models.Project).filter(models.Project.owner_id == current_user).all()
    return projects

async def get_project_by_id(project_id, current_user, database):
    """
    Fetches a specific project by ID, ensuring it belongs to the current user.
    """
    # Use singular 'project' table logic implied by your models.
    project = database.query(models.Project).filter_by(id=project_id, owner_id=current_user).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project Not Found!"
        )
    return project

async def delete_project_by_id(project_id, database):
    """
    Deletes a project by its primary key ID.
    """
    database.query(models.Project).filter(
        models.Project.id == project_id).delete()
    database.commit()

async def update_project_by_id(request, project_id, current_user, database):
    """
    Updates the title or description of an existing project.
    """
    # Ensure consistency by using current_user directly.
    project = database.query(models.Project).filter_by(id=project_id, owner_id=current_user).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project Not Found!"
        )
    
    # Only update fields if they are provided in the request
    project.title = request.title if request.title else project.title
    project.description = request.description if request.description else project.description
    
    database.commit()
    database.refresh(project)
    return project
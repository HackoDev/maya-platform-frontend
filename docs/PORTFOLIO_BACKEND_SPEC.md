## Portfolio Backend Specification (Django + DRF)

This document defines the backend specification for the Specialist Portfolio, aligned with the existing frontend `NeuralNetworkProfileSchema` and composed `ProfileViewData`. It includes:

- OpenAPI schema (backend-first, FE-aligned)
- Normalized authoring models (source of truth)
- Denormalized cached model (published view)
- Converters and signals to keep cache in sync
- CRUD endpoints for authoring steps
- Public endpoints for cached portfolios (list, details, random)
- Code samples (Django models, DRF serializers/views)
- Caching/ETag strategy and publishing flow

---

## OpenAPI (v1)

```yaml
openapi: 3.0.3
info:
  title: Maya Platform - Specialist Portfolio API
  version: 1.0.0
servers:
  - url: /api

components:
  schemas:
    ID: { type: string }
    Timestamp: { type: string, format: date-time }

    ProfileStatus:
      type: string
      enum: [draft, pending, approved, rejected]

    AvailabilityStatus:
      type: string
      enum: [available, busy, unavailable]

    PriceType:
      type: string
      enum: [fixed, hourly, project, negotiable]

    FileReference:
      type: object
      required: [url, filename, size, mimeType]
      properties:
        url: { type: string, format: uri }
        filename: { type: string }
        size: { type: integer }
        mimeType: { type: string }
        thumbnailUrl: { type: string, format: uri }

    TestimonialPhoto:
      type: object
      required: [id, url, title]
      properties:
        id: { $ref: '#/components/schemas/ID' }
        url: { type: string, format: uri }
        title: { type: string }

    PortfolioType:
      type: string
      enum: [text, link, visual, bot, landing]

    PortfolioCase:
      type: object
      required: [id, title, description, type, content, createdAt]
      properties:
        id: { $ref: '#/components/schemas/ID' }
        title: { type: string }
        description: { type: string }
        type: { $ref: '#/components/schemas/PortfolioType' }
        content:
          oneOf:
            - { type: string }
            - { $ref: '#/components/schemas/FileReference' }
        result: { type: string }
        tools: { type: array, items: { type: string } }
        createdAt: { $ref: '#/components/schemas/Timestamp' }
        thumbnailUrl: { type: string, format: uri }

    ExperienceEntry:
      type: object
      required: [id, client, task, tools, result]
      properties:
        id: { $ref: '#/components/schemas/ID' }
        client: { type: string }
        task: { type: string }
        tools: { type: array, items: { type: string } }
        result: { type: string }
        duration: { type: string }
        year: { type: string }
        projectType: { type: string }

    TestimonialData:
      type: object
      required: [photos, totalCount]
      properties:
        photos: { type: array, items: { $ref: '#/components/schemas/TestimonialPhoto' } }
        totalCount: { type: integer }

    ContactInfo:
      type: object
      properties:
        phone: { type: string }
        telegram: { type: string }
        whatsapp: { type: string }
        instagram: { type: string }

    ServiceDetails:
      type: object
      required: [name, price, priceType, isCustom]
      properties:
        name: { type: string }
        description: { type: string }
        price:
          oneOf:
            - { type: number }
            - { type: string }
        priceType: { $ref: '#/components/schemas/PriceType' }
        category: { type: string }
        isCustom: { type: boolean }

    SpecialistBasicProfile:
      type: object
      required: [id, userId, displayName, superpower, status, lastActive]
      properties:
        id: { $ref: '#/components/schemas/ID' }
        userId: { $ref: '#/components/schemas/ID' }
        displayName: { type: string }
        superpower: { type: string }
        avatarUrl: { type: string, format: uri, nullable: true }
        status: { $ref: '#/components/schemas/AvailabilityStatus' }
        isOpenToOffers: { type: boolean }
        lastActive: { $ref: '#/components/schemas/Timestamp' }
        specializations: { type: array, items: { type: string } }
        abilities: { type: array, items: { type: string } }
        services:
          type: array
          items:
            type: object
            required: [name, price, priceType]
            properties:
              name: { type: string }
              price: { type: number }
              priceType: { $ref: '#/components/schemas/PriceType' }
        contacts:
          type: object
          properties:
            telegram: { type: string }
            email: { type: string }

    NeuralNetworkProfileSchema:
      type: object
      required: [id, userId, profileType, version, metadata, status, profileCompleted, createdAt, updatedAt]
      properties:
        id: { $ref: '#/components/schemas/ID' }
        userId: { $ref: '#/components/schemas/ID' }
        profileType: { type: string, enum: ['neural-network'] }
        version: { type: string }
        metadata:
          type: object
          properties:
            completionPercentage: { type: integer }
            lastModifiedBlock: { type: string }
            validationErrors: { type: array, items: { type: string } }
            isDraft: { type: boolean }
            submissionAttempts: { type: integer }
            moderationNotes: { type: array, items: { type: string } }
        specializations:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data:
              type: object
              properties:
                neuralAssistants: { type: boolean }
                neuralFunnels: { type: boolean }
                contentGeneration: { type: boolean }
                visuals: { type: boolean }
                audioVideoProcessing: { type: boolean }
                promptBases: { type: boolean }
                chatbotSetup: { type: boolean }
                neuralNetworkTraining: { type: boolean }
                customSpecializations: { type: array, items: { type: string } }
            validation:
              type: object
              properties:
                required: { type: boolean }
                minSelected: { type: integer }
                maxSelected: { type: integer }
        superpower:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            placeholder: { type: string }
            data:
              type: object
              properties:
                text: { type: string }
            validation:
              type: object
              properties:
                required: { type: boolean }
                minLength: { type: integer }
                maxLength: { type: integer }
                characterCount: { type: boolean }
        abilities:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data:
              type: object
              properties:
                funnelAssembly: { type: boolean }
                personalAIAssistants: { type: boolean }
                sellingTextsWithGPT: { type: boolean }
                visualGeneration: { type: boolean }
                reelsContentAI: { type: boolean }
                videoProcessing: { type: boolean }
                funnelAutomation: { type: boolean }
                promptBases: { type: boolean }
                trainingConsultations: { type: boolean }
                customAbilities: { type: array, items: { type: string } }
            validation:
              type: object
              properties:
                required: { type: boolean }
                minSelected: { type: integer }
        portfolio:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data: { type: array, items: { $ref: '#/components/schemas/PortfolioCase' } }
            validation:
              type: object
              properties:
                required: { type: boolean }
                maxItems: { type: integer }
        services:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data:
              type: object
              properties:
                predefinedServices:
                  type: object
                  additionalProperties:
                    type: object
                    properties:
                      selected: { type: boolean }
                      name: { type: string }
                      basePrice: { type: number }
                      customPrice: { type: number }
                      description: { type: string }
                customServices:
                  type: array
                  items:
                    type: object
                    required: [id, name, price, priceType]
                    properties:
                      id: { $ref: '#/components/schemas/ID' }
                      name: { type: string }
                      description: { type: string }
                      price: { type: number }
                      priceType: { $ref: '#/components/schemas/PriceType' }
            validation:
              type: object
              properties:
                required: { type: boolean }
        experience:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data: { type: array, items: { $ref: '#/components/schemas/ExperienceEntry' } }
            validation:
              type: object
              properties:
                required: { type: boolean }
                maxItems: { type: integer }
        testimonials:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data:
              type: object
              properties:
                photos: { type: array, items: { $ref: '#/components/schemas/TestimonialPhoto' } }
            validation:
              type: object
              properties:
                required: { type: boolean }
                maxPhotos: { type: integer }
                allowedTypes: { type: array, items: { type: string } }
                maxFileSize: { type: integer }
        contacts:
          type: object
          properties:
            title: { type: string }
            description: { type: string }
            data: { $ref: '#/components/schemas/ContactInfo' }
            validation:
              type: object
              properties:
                required: { type: boolean }
                atLeastOne: { type: array, items: { type: string } }
                telegramFormat: { type: boolean }
                instagramFormat: { type: boolean }
        status: { $ref: '#/components/schemas/ProfileStatus' }
        profileCompleted: { type: boolean }
        createdAt: { $ref: '#/components/schemas/Timestamp' }
        updatedAt: { $ref: '#/components/schemas/Timestamp' }

    ProfileViewData:
      type: object
      required: [basicInfo, detailedInfo, metadata]
      properties:
        basicInfo:
          type: object
          required: [id, userId, displayName, superpower, status, lastActive]
          properties:
            id: { $ref: '#/components/schemas/ID' }
            userId: { $ref: '#/components/schemas/ID' }
            displayName: { type: string }
            superpower: { type: string }
            avatarUrl: { type: string, format: uri, nullable: true }
            status: { $ref: '#/components/schemas/AvailabilityStatus' }
            isOpenToOffers: { type: boolean }
            lastActive: { $ref: '#/components/schemas/Timestamp' }
        detailedInfo:
          type: object
          required: [specializations, abilities, services, portfolio, experience, testimonials, contacts]
          properties:
            specializations: { type: array, items: { type: string } }
            abilities: { type: array, items: { type: string } }
            services: { type: array, items: { $ref: '#/components/schemas/ServiceDetails' } }
            portfolio: { type: array, items: { $ref: '#/components/schemas/PortfolioCase' } }
            experience: { type: array, items: { $ref: '#/components/schemas/ExperienceEntry' } }
            testimonials: { $ref: '#/components/schemas/TestimonialData' }
            contacts: { $ref: '#/components/schemas/ContactInfo' }
        metadata:
          type: object
          required: [profileCompleted, completionPercentage, moderationStatus, lastUpdated]
          properties:
            profileCompleted: { type: boolean }
            completionPercentage: { type: integer }
            moderationStatus: { $ref: '#/components/schemas/ProfileStatus' }
            lastUpdated: { $ref: '#/components/schemas/Timestamp' }

  parameters:
    CacheableETag:
      name: If-None-Match
      in: header
      schema: { type: string }
    SectionsQuery:
      name: include
      in: query
      description: Optional sections to include (comma-separated), e.g. portfolio,experience,testimonials
      schema: { type: string }

paths:
  /specialists/{id}/basic:
    get:
      summary: Get basic specialist profile (search card data)
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
        - $ref: '#/components/parameters/CacheableETag'
      responses:
        '200':
          description: OK
          headers:
            ETag: { schema: { type: string } }
            Cache-Control: { schema: { type: string }, description: 'public, max-age=60, stale-while-revalidate=120' }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/SpecialistBasicProfile' }
        '304':
          description: Not Modified

  /portfolio/{id}/specializations:
    put:
      summary: Upsert specializations block
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                data: { type: object }
                title: { type: string }
                description: { type: string }
                validation: { type: object }
      responses:
        '200': { description: Updated }

  /portfolio/{id}/superpower:
    put:
      summary: Upsert superpower block
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                data: { type: object }
                title: { type: string }
                description: { type: string }
                placeholder: { type: string }
                validation: { type: object }
      responses:
        '200': { description: Updated }

  /portfolio/{id}/abilities:
    put:
      summary: Upsert abilities block
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                data: { type: object }
                title: { type: string }
                description: { type: string }
                validation: { type: object }
      responses:
        '200': { description: Updated }

  /portfolio/{id}/services:
    put:
      summary: Upsert services block
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                data: { type: object }
                title: { type: string }
                description: { type: string }
                validation: { type: object }
      responses:
        '200': { description: Updated }

  /portfolio/{id}/items:
    get:
      summary: List portfolio items
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
        - name: page
          in: query
          schema: { type: integer, minimum: 1 }
        - name: page_size
          in: query
          schema: { type: integer, minimum: 1, maximum: 50, default: 20 }
        - name: type
          in: query
          schema: { $ref: '#/components/schemas/PortfolioType' }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                required: [count, results]
                properties:
                  count: { type: integer }
                  next: { type: string, format: uri, nullable: true }
                  previous: { type: string, format: uri, nullable: true }
                  results: { type: array, items: { $ref: '#/components/schemas/PortfolioCase' } }
    post:
      summary: Create portfolio item
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PortfolioCase' }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PortfolioCase' }

  /portfolio/{id}/items/{item_id}:
    patch:
      summary: Update portfolio item (partial)
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
        - name: item_id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PortfolioCase' }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PortfolioCase' }
    delete:
      summary: Delete portfolio item
      responses:
        '204': { description: No Content }

  /portfolio/{id}/experience:
    get:
      summary: List experience entries
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/ExperienceEntry' }
    post:
      summary: Create experience entry
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ExperienceEntry' }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ExperienceEntry' }
  /portfolio/{id}/experience/{exp_id}:
    patch:
      summary: Update experience entry
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
        - name: exp_id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ExperienceEntry' }
      responses:
        '200': { description: OK }
    delete:
      summary: Delete experience entry
      responses:
        '204': { description: No Content }

  /portfolio/{id}/testimonials/photos:
    get:
      summary: List testimonial photos
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  photos:
                    type: array
                    items: { $ref: '#/components/schemas/TestimonialPhoto' }
                  totalCount: { type: integer }
    post:
      summary: Add testimonial photo (metadata)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/TestimonialPhoto' }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/TestimonialPhoto' }
  /portfolio/{id}/testimonials/photos/{photo_id}:
    delete:
      summary: Delete testimonial photo
      responses:
        '204': { description: No Content }

  /portfolio/{id}/contacts:
    put:
      summary: Upsert contacts block
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ContactInfo' }
      responses:
        '200': { description: Updated }

  /portfolio/{id}/submit:
    post:
      summary: Submit for moderation (status: pending)
      responses:
        '202': { description: Submitted }

  /portfolio/{id}/approve:
    post:
      summary: Approve portfolio (admin) and build cached version
      responses:
        '200': { description: Approved }

  /portfolio/{id}/reject:
    post:
      summary: Reject portfolio (admin)
      responses:
        '200': { description: Rejected }

  /public/portfolios:
    get:
      summary: List published cached portfolios
      parameters:
        - name: specialization
          in: query
          schema: { type: string }
        - name: q
          in: query
          schema: { type: string }
        - name: page
          in: query
          schema: { type: integer, minimum: 1 }
        - name: page_size
          in: query
          schema: { type: integer, minimum: 1, maximum: 50, default: 20 }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                required: [count, results]
                properties:
                  count: { type: integer }
                  next: { type: string, format: uri, nullable: true }
                  previous: { type: string, format: uri, nullable: true }
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        id: { $ref: '#/components/schemas/ID' }
                        display_name: { type: string }
                        superpower: { type: string }
                        avatar_url: { type: string, format: uri }
                        status: { $ref: '#/components/schemas/AvailabilityStatus' }
                        specializations: { type: array, items: { type: string } }
                        abilities: { type: array, items: { type: string } }
                        services: { type: array, items: { $ref: '#/components/schemas/ServiceDetails' } }
                        last_updated: { $ref: '#/components/schemas/Timestamp' }

  /public/portfolios/{id}:
    get:
      summary: Get published cached portfolio details
      parameters:
        - name: id
          in: path
          required: true
          schema: { $ref: '#/components/schemas/ID' }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ProfileViewData' }

  /public/portfolios/random:
    get:
      summary: Get N random published cached portfolios
      parameters:
        - name: limit
          in: query
          schema: { type: integer, minimum: 1, maximum: 50, default: 6 }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/ProfileViewData' }
```

---

## Data Model

### Authoring (normalized, source of truth)

```python
from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.utils import timezone
from uuid import uuid4

def uid(): return uuid4().hex

class Specialist(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uid)
    user_id = models.CharField(max_length=64, db_index=True)
    display_name = models.CharField(max_length=255)
    superpower = models.TextField(blank=True, default='')
    avatar_url = models.URLField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=[('available','available'),('busy','busy'),('unavailable','unavailable')], default='available')
    last_active = models.DateTimeField(default=timezone.now)

class PortfolioProfile(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uid)
    specialist = models.OneToOneField(Specialist, on_delete=models.CASCADE, related_name='portfolio_profile')
    version = models.CharField(max_length=32, default='1.0')
    status = models.CharField(max_length=16, choices=[('draft','draft'),('pending','pending'),('approved','approved'),('rejected','rejected')], default='draft')
    metadata = JSONField(default=dict)
    profile_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Specializations(models.Model):
    profile = models.OneToOneField(PortfolioProfile, on_delete=models.CASCADE, related_name='specializations')
    data = JSONField(default=dict)
    title = models.CharField(max_length=255, default='Я специализируюсь на:')
    description = models.TextField(blank=True, default='')
    validation = JSONField(default=dict)

class Superpower(models.Model):
    profile = models.OneToOneField(PortfolioProfile, on_delete=models.CASCADE, related_name='superpower')
    data = JSONField(default=dict)
    title = models.CharField(max_length=255, default='Коротко о себе (до 200 символов)')
    description = models.TextField(blank=True, default='')
    placeholder = models.CharField(max_length=255, blank=True, default='')
    validation = JSONField(default=dict)

class Abilities(models.Model):
    profile = models.OneToOneField(PortfolioProfile, on_delete=models.CASCADE, related_name='abilities')
    data = JSONField(default=dict)
    title = models.CharField(max_length=255, default='Что ты умеешь?')
    description = models.TextField(blank=True, default='')
    validation = JSONField(default=dict)

class Services(models.Model):
    profile = models.OneToOneField(PortfolioProfile, on_delete=models.CASCADE, related_name='services')
    data = JSONField(default=dict)
    title = models.CharField(max_length=255, default='Твои услуги и цены')
    description = models.TextField(blank=True, default='')
    validation = JSONField(default=dict)

class PortfolioItem(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uid)
    profile = models.ForeignKey(PortfolioProfile, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=16, choices=[('text','text'),('link','link'),('visual','visual'),('bot','bot'),('landing','landing')])
    content = JSONField()
    result = models.TextField(blank=True, default='')
    tools = ArrayField(models.CharField(max_length=128), default=list, blank=True)
    created_at = models.DateTimeField()
    thumbnail_url = models.URLField(blank=True, default='')

class ExperienceEntry(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uid)
    profile = models.ForeignKey(PortfolioProfile, on_delete=models.CASCADE, related_name='experience_entries')
    client = models.CharField(max_length=255)
    task = models.TextField()
    tools = ArrayField(models.CharField(max_length=128), default=list, blank=True)
    result = models.TextField()
    duration = models.CharField(max_length=64, blank=True, default='')
    year = models.CharField(max_length=8, blank=True, default='')
    project_type = models.CharField(max_length=64, blank=True, default='')

class TestimonialPhoto(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=uid)
    profile = models.ForeignKey(PortfolioProfile, on_delete=models.CASCADE, related_name='testimonial_photos')
    url = models.URLField()
    title = models.CharField(max_length=255)

class Contacts(models.Model):
    profile = models.OneToOneField(PortfolioProfile, on_delete=models.CASCADE, related_name='contacts')
    data = JSONField(default=dict)
    title = models.CharField(max_length=255, default='Как тебе можно написать?')
    description = models.TextField(blank=True, default='')
    validation = JSONField(default=dict)
```

### Cached (denormalized, published)

```python
class CachedPortfolio(models.Model):
    id = models.CharField(primary_key=True, max_length=64)  # Specialist.id
    specialist_id = models.CharField(max_length=64, db_index=True)
    display_name = models.CharField(max_length=255)
    superpower = models.TextField()
    avatar_url = models.URLField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=[('available','available'),('busy','busy'),('unavailable','unavailable')], default='available')
    last_active = models.DateTimeField()

    specializations = ArrayField(models.CharField(max_length=255), default=list, blank=True)
    abilities = ArrayField(models.CharField(max_length=255), default=list, blank=True)
    services = JSONField(default=list)
    portfolio = JSONField(default=list)
    experience = JSONField(default=list)
    testimonials = JSONField(default=dict)
    contacts = JSONField(default=dict)

    profile_completed = models.BooleanField(default=False)
    completion_percentage = models.IntegerField(default=0)
    moderation_status = models.CharField(max_length=16, choices=[('draft','draft'),('pending','pending'),('approved','approved'),('rejected','rejected')], default='draft')
    last_updated = models.DateTimeField(auto_now=True)

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['is_published', 'last_updated']),
        ]
```

---

## Converters and Signals

```python
from django.utils import timezone

SPECIALIZATION_LABELS = {
    'neuralAssistants': 'Нейроассистенты (AI-боты)',
    'neuralFunnels': 'Нейроворонки (продажи + автоматизация)',
    'contentGeneration': 'Контент с помощью нейросетей',
    'visuals': 'Визуалы (обложки, графика, Reels)',
    'audioVideoProcessing': 'Обработка аудио и видео',
    'promptBases': 'Базы промптов',
    'chatbotSetup': 'Настройка чат-ботов',
    'neuralNetworkTraining': 'Обучение других нейросетям',
}

ABILITY_LABELS = {
    'funnelAssembly': 'Собираю нейроворонки (от лида до оплаты)',
    'personalAIAssistants': 'Создаю персональных AI-ассистентов',
    'sellingTextsWithGPT': 'Пишу продающие тексты с ChatGPT',
    'visualGeneration': 'Генерирую визуалы в Midjourney/DALLE',
    'reelsContentAI': 'Настраиваю Reels-контент с помощью AI',
    'videoProcessing': 'Обрабатываю видео в нейросетях',
    'funnelAutomation': 'Автоматизирую воронки с GPT + Tilda/Telegram',
    'promptBases': 'Делаю базы промптов под задачи клиента',
    'trainingConsultations': 'Провожу обучение/консультации',
}

def extract_specializations(data: dict) -> list[str]:
    labels = [lbl for key, lbl in SPECIALIZATION_LABELS.items() if data.get(key)]
    labels += data.get('customSpecializations', []) or []
    return labels

def extract_abilities(data: dict) -> list[str]:
    labels = [lbl for key, lbl in ABILITY_LABELS.items() if data.get(key)]
    labels += data.get('customAbilities', []) or []
    return labels

def map_services(svc: dict) -> list[dict]:
    out = []
    for _, s in (svc.get('predefinedServices') or {}).items():
        if s.get('selected'):
            out.append({
                'name': s.get('name'),
                'description': s.get('description'),
                'price': s.get('customPrice') or s.get('basePrice'),
                'priceType': 'fixed',
                'category': 'predefined',
                'isCustom': False
            })
    for s in svc.get('customServices') or []:
        out.append({
            'name': s.get('name'),
            'description': s.get('description'),
            'price': s.get('price'),
            'priceType': s.get('priceType'),
            'category': 'custom',
            'isCustom': True
        })
    return out

def build_cached_portfolio(profile: PortfolioProfile) -> CachedPortfolio:
    sp = profile.specialist
    spec = getattr(profile, 'specializations', None)
    abil = getattr(profile, 'abilities', None)
    svc = getattr(profile, 'services', None)
    contacts = getattr(profile, 'contacts', None)

    portfolio_cases = [
        {
            'id': it.id,
            'title': it.title,
            'description': it.description,
            'type': it.type,
            'content': it.content,
            'result': it.result,
            'tools': it.tools,
            'createdAt': it.created_at.isoformat(),
            'thumbnailUrl': it.thumbnail_url or None
        } for it in profile.portfolio_items.all().order_by('-created_at')
    ]

    experience = [
        {
            'id': it.id,
            'client': it.client,
            'task': it.task,
            'tools': it.tools,
            'result': it.result,
            'duration': it.duration,
            'year': it.year,
            'projectType': it.project_type
        } for it in profile.experience_entries.all()
    ]

    photos = [{'id': p.id, 'url': p.url, 'title': p.title} for p in profile.testimonial_photos.all()]
    testimonials = { 'photos': photos, 'totalCount': len(photos) }

    cp, _ = CachedPortfolio.objects.update_or_create(
        id=sp.id,
        defaults={
            'specialist_id': sp.user_id,
            'display_name': sp.display_name,
            'superpower': sp.superpower,
            'avatar_url': sp.avatar_url,
            'status': sp.status,
            'last_active': sp.last_active,

            'specializations': extract_specializations((spec and spec.data) or {}),
            'abilities': extract_abilities((abil and abil.data) or {}),
            'services': map_services((svc and svc.data) or {}),
            'portfolio': portfolio_cases,
            'experience': experience,
            'testimonials': testimonials,
            'contacts': (contacts and contacts.data) or {},

            'profile_completed': profile.profile_completed,
            'completion_percentage': (profile.metadata or {}).get('completionPercentage', 0),
            'moderation_status': profile.status,
            'is_published': profile.status == 'approved',
            'published_at': timezone.now() if profile.status == 'approved' else None,
        }
    )
    return cp
```

### Signals

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=PortfolioProfile)
def on_profile_save(sender, instance: PortfolioProfile, **kwargs):
    if instance.status == 'approved':
        build_cached_portfolio(instance)

for _sender in (Specializations, Superpower, Abilities, Services, PortfolioItem, ExperienceEntry, TestimonialPhoto, Contacts):
    @receiver(post_save, sender=_sender)
    def on_section_save(sender, instance, **kwargs):
        profile = instance.profile if hasattr(instance, 'profile') else instance.profile
        if profile.status == 'approved':
            build_cached_portfolio(profile)
```

---

## Endpoints (DRF)

### Authoring (by steps)

- PUT `/api/portfolio/{id}/specializations`
- PUT `/api/portfolio/{id}/superpower`
- PUT `/api/portfolio/{id}/abilities`
- PUT `/api/portfolio/{id}/services`
- GET/POST `/api/portfolio/{id}/items` | PATCH/DELETE `/api/portfolio/{id}/items/{item_id}`
- GET/POST `/api/portfolio/{id}/experience` | PATCH/DELETE `/api/portfolio/{id}/experience/{exp_id}`
- GET/POST `/api/portfolio/{id}/testimonials/photos` | DELETE `/api/portfolio/{id}/testimonials/photos/{photo_id}`
- PUT `/api/portfolio/{id}/contacts`
- POST `/api/portfolio/{id}/submit` (→ pending)
- POST `/api/portfolio/{id}/approve` (admin) → builds cache
- POST `/api/portfolio/{id}/reject` (admin)

### Public (cached)

- GET `/api/public/portfolios` — paginated list, filters `specialization`, `q`
- GET `/api/public/portfolios/{id}` — details
- GET `/api/public/portfolios/random?limit=N` — N random published

---

## DRF Serializers (samples)

```python
from rest_framework import serializers

class FileReferenceSerializer(serializers.Serializer):
    url = serializers.URLField()
    filename = serializers.CharField()
    size = serializers.IntegerField()
    mimeType = serializers.CharField()
    thumbnailUrl = serializers.URLField(required=False, allow_blank=True)

class PortfolioCaseSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    type = serializers.ChoiceField(choices=['text','link','visual','bot','landing'])
    content = serializers.JSONField()
    result = serializers.CharField(required=False, allow_blank=True)
    tools = serializers.ListField(child=serializers.CharField(), required=False)
    createdAt = serializers.DateTimeField()
    thumbnailUrl = serializers.URLField(required=False, allow_blank=True)

class CachedPortfolioListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CachedPortfolio
        fields = ['id','display_name','superpower','avatar_url','status','specializations','abilities','services','last_updated','is_published']

class CachedPortfolioDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CachedPortfolio
        fields = ['id','specialist_id','display_name','superpower','avatar_url','status','last_active',
                  'specializations','abilities','services','portfolio','experience','testimonials','contacts',
                  'profile_completed','completion_percentage','moderation_status','last_updated','published_at']
```

## DRF Views (samples)

```python
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
import random

class PublicPortfolioViewSet(ReadOnlyModelViewSet):
    queryset = CachedPortfolio.objects.filter(is_published=True)
    serializer_class = CachedPortfolioListSerializer

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        spec = request.query_params.get('specialization')
        q = request.query_params.get('q')
        if spec: qs = qs.filter(specializations__icontains=spec)
        if q: qs = qs.filter(Q(display_name__icontains=q) | Q(superpower__icontains=q))
        self.queryset = qs.order_by('-last_updated')
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CachedPortfolioDetailSerializer
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='random')
    def random(self, request):
        limit = max(1, min(int(request.query_params.get('limit', '6')), 50))
        ids = list(self.get_queryset().values_list('id', flat=True))
        if not ids:
            return Response([])
        sample_ids = random.sample(ids, k=min(limit, len(ids)))
        data = CachedPortfolioDetailSerializer(self.get_queryset().filter(id__in=sample_ids), many=True).data
        return Response(data)
```

---

## Caching and ETag

- Use ETag for GET responses. Suggest `sha256` of `{"id", "last_updated"}` or entire payload for small responses.
- Recommended headers:
  - `Cache-Control: public, max-age=60, stale-while-revalidate=120` (schema); 30–120s depending on endpoint
  - `ETag: <hash>` and respect `If-None-Match`
- Server-side caching for read endpoints (e.g., `cache_page(60)`).
- Invalidation: on approval or any change while approved, rebuild `CachedPortfolio` and optionally bust per-id caches.

---

## Publishing Flow

1. Author edits steps via authoring endpoints on `PortfolioProfile` and related entities.
2. Submit → status `pending`.
3. Approve (admin) → create/update `CachedPortfolio` and set `is_published=true`.
4. While approved, any updates trigger converter to refresh cached entity.

---

## Example: Public Details Response

```json
{
  "basicInfo": {
    "id": "specialist-1",
    "userId": "user-1",
    "displayName": "Анна Иванова",
    "superpower": "Создаю AI-ассистентов для автоматизации бизнес-процессов и увеличения продаж",
    "avatarUrl": null,
    "status": "available",
    "lastActive": "2024-01-15T10:30:00Z"
  },
  "detailedInfo": {
    "specializations": [
      "Нейроассистенты (AI-боты)",
      "Нейроворонки (продажи + автоматизация)"
    ],
    "abilities": [
      "Собираю нейроворонки (от лида до оплаты)",
      "Создаю персональных AI-ассистентов"
    ],
    "services": [
      {
        "name": "Нейроассистент под ключ",
        "price": 18000,
        "priceType": "fixed",
        "category": "predefined",
        "isCustom": false
      }
    ],
    "portfolio": [
      {
        "id": "portfolio-1",
        "title": "AI-ассистент для стоматологической клиники",
        "description": "Создал чат-бота для записи пациентов и консультаций. Сократил время обработки заявок на 70%.",
        "type": "bot",
        "content": "https://t.me/dental_ai_bot",
        "result": "Увеличение конверсии на 40%, автоматизация 90% запросов",
        "tools": ["ChatGPT API", "Telegram Bot API", "Google Sheets"],
        "createdAt": "2024-01-10T10:00:00Z"
      }
    ],
    "experience": [],
    "testimonials": { "photos": [], "totalCount": 0 },
    "contacts": {
      "telegram": "@anna_ai_expert",
      "instagram": "https://instagram.com/anna_ai_expert",
      "phone": "+7 (999) 123-45-67",
      "whatsapp": "+7 (999) 123-45-67"
    }
  },
  "metadata": {
    "profileCompleted": true,
    "completionPercentage": 95,
    "moderationStatus": "approved",
    "lastUpdated": "2024-01-15T12:30:00Z"
  }
}
```

---

## Notes

- Field names in responses follow FE conventions (`userId`, `profileCompleted`, `createdAt`).
- Portfolio `content` supports either a URL/text string or a `FileReference` object.
- Add upload endpoints for testimonial photos if using object storage; validate against `allowedTypes` and `maxFileSize`.



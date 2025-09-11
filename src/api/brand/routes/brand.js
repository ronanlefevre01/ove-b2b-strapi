// src/api/brand/routes/brand.js
export default {
  routes: [
    {
      method: 'GET',
      path: '/brands',
      handler: 'brand.find',
      config: { auth: true }, // ou false si tu veux accessible sans token
    },
    {
      method: 'GET',
      path: '/brands/:id',
      handler: 'brand.findOne',
      config: { auth: true },
    },
    {
      method: 'POST',
      path: '/brands',
      handler: 'brand.create',
      config: { auth: true },
    },
    {
      method: 'PUT',
      path: '/brands/:id',
      handler: 'brand.update',
      config: { auth: true },
    },
    {
      method: 'DELETE',
      path: '/brands/:id',
      handler: 'brand.delete',
      config: { auth: true },
    },
  ],
};

import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {DoorsOpenInput} from './components/doors-open-input'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  preview: {
    select: {
      title: 'name',
      media: 'image',
      artist1: 'headliners.0.name',
      artist2: 'headliners.1.name',
      artist3: 'headliners.2.name',
    },
    prepare(selection) {
      const {title, media, artist1, artist2, artist3} = selection
      const artists = [artist1, artist2].filter(Boolean)
      const subtitle = artists.length > 0 ? `Artists: ${artists.join(', ')}` : ''
      const hasMoreArtists = Boolean(artist3)

      return {
        title,
        subtitle: hasMoreArtists ? `${subtitle}…` : subtitle,
        media,
      }
    },
  },
  fieldsets: [
    {
      name: 'venueTimers',
      title: 'Venue timers!',
      options: {columns: 2},
    },
  ],
  groups: [
    {name: 'details', title: 'Details', default: true},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w-]+/g, '') // Remove non-word chars
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required().error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
      group: 'details',
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
      group: ['details', 'editorial'],
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      fieldset: 'venueTimers',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the start time for admission',
      type: 'number',
      fieldset: 'venueTimers',
      initialValue: 60,
      group: 'details',
      components: {
        input: DoorsOpenInput,
      },
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: {type: 'venue'},
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }

          return true
        }),
      readOnly: ({value, document}) => !value && document?.eventType === 'virtual',
      group: 'details',
    }),
    defineField({
      name: 'headliners',
      title: 'Headliners (artists)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artist'}],
        },
      ],
      group: 'details',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
      group: 'editorial',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      placeholder: 'url modafocka',
      group: 'details',
    }),
  ],
})

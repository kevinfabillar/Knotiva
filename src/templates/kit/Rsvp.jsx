import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { seatLine, useInvite } from './context.jsx';

// Demo guest list. On a real invitation this comes from the couple's guest list.
export const DEMO_PARTIES = [
  ['Maria Santos', 'Carlos Santos'],
  ['Juan Dela Cruz', 'Ana Dela Cruz', 'Miguel Dela Cruz'],
  ['Grace Lim'],
  ['Paolo Reyes', 'Bea Reyes'],
  ['Sofia Garcia', 'Daniel Garcia'],
];

const norm = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

function findParties(query, parties) {
  const q = norm(query);
  if (q.length === 0) return [];
  return parties.filter((party) => party.some((name) => q.every((t) => norm(name).some((w) => w.startsWith(t)))));
}

/**
 * The RSVP card: find your name → answer for everyone in your party → details → done.
 * `couple` = { a, b }, `deadline` = "February 1, 2027"
 */
export function Rsvp({ couple, deadline, parties = DEMO_PARTIES, className = '' }) {
  const { guest } = useInvite();
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState(guest?.name || '');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);
  const [party, setParty] = useState(null);
  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState({ diet: '', song: '', note: '' });

  const choose = (p) => {
    setParty(p);
    setAnswers({});
    setMatches([]);
    setStep(2);
  };

  const search = (e) => {
    e.preventDefault();
    const found = findParties(query, parties);
    if (found.length === 0) {
      setError('We couldn’t find that name on the guest list. Please use the name on your invitation.');
    } else if (found.length === 1) {
      setError('');
      choose(found[0]);
    } else {
      setError('');
      setMatches(found);
    }
  };

  const allAnswered = party && party.every((n) => answers[n]);
  const attending = party ? party.filter((n) => answers[n] === 'yes') : [];

  const steps = ['Find your invitation', 'Your party', 'A few details'];

  return (
    <div className={`k-rsvp ${className}`}>
      {step < 4 && (
        <ol className="k-rsvp-steps" aria-label="RSVP progress">
          {steps.map((s, i) => (
            <li key={s} className={i + 1 === step ? 'is-on' : i + 1 < step ? 'is-done' : ''}>
              <span>{i + 1}</span>
              <em>{s}</em>
            </li>
          ))}
        </ol>
      )}

      {step === 1 && (
        <form className="k-rsvp-body" onSubmit={search}>
          <p className="k-rsvp-lead">
            Please enter the first and last name of one member of your party. If you&rsquo;re replying for your family too, you can answer for everyone on the next step.
          </p>
          <label className="k-field">
            <span>First and last name</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError('');
                setMatches([]);
              }}
              autoComplete="name"
              placeholder="e.g. Maria Santos"
              required
            />
          </label>
          {error && (
            <p className="k-rsvp-error" role="alert">
              {error}
            </p>
          )}
          {matches.length > 1 && (
            <div className="k-rsvp-matches">
              <p>We found more than one invitation. Which one is yours?</p>
              {matches.map((m) => (
                <button key={m.join()} type="button" onClick={() => choose(m)}>
                  {m.join(', ')}
                </button>
              ))}
            </div>
          )}
          <button type="submit" className="k-btn k-btn--block">
            <Icon name="search" size={16} stroke={1.6} />
            Find my invitation
          </button>
          <p className="k-rsvp-hint">Demo guests: Maria Santos, Juan Dela Cruz, Grace Lim</p>
        </form>
      )}

      {step === 2 && party && (
        <div className="k-rsvp-body">
          <p className="k-rsvp-lead">
            We have reserved {seatLine({ seats: party.length })} in your honor. Will you be joining {couple.a} &amp; {couple.b}?
          </p>
          <ul className="k-rsvp-party">
            {party.map((name) => (
              <li key={name}>
                <span className="k-rsvp-name">{name}</span>
                <span className="k-seg" role="radiogroup" aria-label={`${name} attending?`}>
                  {[
                    ['yes', 'Accepts'],
                    ['no', 'Declines'],
                  ].map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={answers[name] === v}
                      className={answers[name] === v ? 'is-on' : ''}
                      onClick={() => setAnswers((a) => ({ ...a, [name]: v }))}
                    >
                      {label}
                    </button>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <div className="k-rsvp-nav">
            <button type="button" className="k-link" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="k-btn" disabled={!allAnswered} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form
          className="k-rsvp-body"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(4);
          }}
        >
          {attending.length > 0 ? (
            <>
              <label className="k-field">
                <span>Dietary needs or allergies</span>
                <input value={details.diet} onChange={(e) => setDetails({ ...details, diet: e.target.value })} placeholder="None" />
              </label>
              <label className="k-field">
                <span>A song that will get you dancing</span>
                <input value={details.song} onChange={(e) => setDetails({ ...details, song: e.target.value })} placeholder="Optional" />
              </label>
            </>
          ) : (
            <p className="k-rsvp-lead">We&rsquo;ll miss you. Would you like to leave the couple a message?</p>
          )}
          <label className="k-field">
            <span>A message for the couple</span>
            <textarea rows="3" value={details.note} onChange={(e) => setDetails({ ...details, note: e.target.value })} placeholder="Optional" />
          </label>
          <div className="k-rsvp-nav">
            <button type="button" className="k-link" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="submit" className="k-btn">
              Send RSVP
            </button>
          </div>
        </form>
      )}

      {step === 4 && party && (
        <div className="k-rsvp-body k-rsvp-done">
          <Icon name={attending.length ? 'heart' : 'mail'} size={34} stroke={1.2} />
          <h3>Thank you, {party[0].split(' ')[0]}!</h3>
          <p className="k-rsvp-lead">
            {attending.length
              ? `${couple.a} & ${couple.b} can't wait to celebrate with you.`
              : `${couple.a} & ${couple.b} will miss you, and will raise a glass to you on the day.`}
          </p>
          <ul className="k-rsvp-summary">
            {party.map((n) => (
              <li key={n}>
                <span>{n}</span>
                <b>{answers[n] === 'yes' ? 'Attending' : 'Not attending'}</b>
              </li>
            ))}
          </ul>
          <p className="k-rsvp-hint">This is a demo. On a real invitation, every reply goes straight to the couple&rsquo;s guest list.</p>
          <button
            type="button"
            className="k-link"
            onClick={() => {
              setStep(1);
              setParty(null);
            }}
          >
            Change response
          </button>
        </div>
      )}

      {step === 1 && deadline && <p className="k-rsvp-deadline">Kindly respond by {deadline}</p>}
    </div>
  );
}
